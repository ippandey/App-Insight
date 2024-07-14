from flask import Flask, request, jsonify
from flask_cors import CORS
from google_play_scraper import Sort, reviews, search
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
import logging
from flask_caching import Cache
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta

nltk.download("punkt")
nltk.download("stopwords")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
cache = Cache(app, config={"CACHE_TYPE": "simple"})  # Configure cache

logging.basicConfig(level=logging.DEBUG)

# Initialize NLTK resources safely
stop_words = set(stopwords.words("english"))

@app.route('/')
def home():
    return "Hello, World!"

def extract_aspect_keywords(review_text):
    if review_text is None:
        return []
    words = word_tokenize(review_text.lower())
    words = [word for word in words if word.isalnum() and word not in stop_words]
    word_freq = Counter(words)
    most_common_words = word_freq.most_common(10)
    aspect_keywords = [word for word, freq in most_common_words]
    return aspect_keywords


def fetch_reviews_in_batches(
    app_id, lang, sort, duration, max_reviews=1000, batch_size=200
):
    reviews_list = []
    continuation_token = None
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = []
        while len(reviews_list) < max_reviews:
            future = executor.submit(
                reviews,
                app_id,
                lang=lang,
                sort=sort,
                count=batch_size,
                continuation_token=continuation_token,
            )
            futures.append(future)
            for future in as_completed(futures):
                batch_reviews, continuation_token = future.result()
                filtered_reviews = filter_reviews_by_duration(batch_reviews, duration)
                reviews_list.extend(filtered_reviews)
                if len(reviews_list) >= max_reviews or continuation_token is None:
                    break
            if continuation_token is None:
                break
    return reviews_list[:max_reviews]


def filter_reviews_by_duration(reviews_list, duration):
    now = datetime.now()
    duration_map = {
        "alltime": timedelta(days=36500),  # Effectively all time
        "lastyear": timedelta(days=365),
        "lastmonth": timedelta(days=30),
        "lastweek": timedelta(days=7),
    }
    duration_timedelta = duration_map.get(duration.lower(), timedelta(days=36500))
    filtered_reviews = [
        review for review in reviews_list if now - review["at"] <= duration_timedelta
    ]
    return filtered_reviews


@app.route("/reviews/<app_id>", methods=["GET"])
def get_reviews(app_id):
    count = request.args.get("count", default=100, type=int)
    duration = request.args.get("duration", default="alltime")
    sort_method = request.args.get("sort", default="newest")

    sort_options = {
        "newest": Sort.NEWEST,
        "mostrelevant": Sort.MOST_RELEVANT,
    }

    if sort_method.lower() not in sort_options:
        sort_method = "newest"  # Default to newest if sort method is invalid

    app.logger.debug(
        f"Received request to fetch {count} reviews for app {app_id} in English language, sorted by {sort_method}, duration {duration}"
    )

    try:
        all_reviews = fetch_reviews_in_batches(
            app_id,
            lang="en",
            sort=sort_options[sort_method.lower()],
            duration=duration,
            max_reviews=1000,
        )
        app.logger.debug(f"Fetched {len(all_reviews)} reviews in total")

        displayed_reviews = all_reviews[:count]  # Display only the requested count

        review_data = []

        # Process reviews asynchronously
        def process_review(review):
            aspect_keywords = extract_aspect_keywords(review["content"])
            return {
                "userName": review["userName"],
                "score": review["score"],
                "at": review["at"].strftime("%Y-%m-%d"),
                "content": review["content"] or "",
                "aspect_keywords": aspect_keywords,
            }

        with ThreadPoolExecutor(max_workers=4) as executor:
            future_to_review = {
                executor.submit(process_review, review): review
                for review in displayed_reviews
            }
            for future in as_completed(future_to_review):
                review_data.append(future.result())

        return jsonify(review_data)
    except Exception as e:
        app.logger.error(f"Error fetching reviews: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/search", methods=["GET"])
def search_apps():
    query = request.args.get("query", default="", type=str)
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        search_results = search(query, lang="en", country="us", n_hits=10)
        results = [
            {
                "appId": result["appId"],
                "title": result["title"],
                "developer": result["developer"],
                "icon": result["icon"],
            }
            for result in search_results
        ]
        return jsonify(results)
    except Exception as e:
        app.logger.error(f"Error searching for apps: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
