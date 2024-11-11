import requests
from PIL import Image
import numpy as np
from io import BytesIO
from nudenet import NudeDetector

# Initialize the detector
detector = NudeDetector()

# List of image URLs
image_urls = [
    'https://i.4cdn.org/h/1727006725110119.jpg',
    'https://i.4cdn.org/h/1728799582822992.jpg',
    'https://i.4cdn.org/h/1728795967813282.png',
    'https://i.4cdn.org/h/1728784555982874.jpg',
]

# Function to fetch images from URLs
def fetch_images(urls):
    images = []
    for url in urls:
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an error for bad responses
            img = Image.open(BytesIO(response.content)).convert('RGB')  # Ensure image is in RGB format
            img_array = np.array(img)  # Convert PIL Image to NumPy array
            images.append(img_array)
        except Exception as e:
            print(f"Error fetching {url}: {e}")
    return images

# Fetch images
fetched_images = fetch_images(image_urls)

# Detect nudity in the fetched images
results = detector.detect_batch(fetched_images)

# Print the results
print(results)
