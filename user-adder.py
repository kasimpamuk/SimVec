import psycopg2
import random
from faker import Faker
from PIL import Image
from io import BytesIO

conn = psycopg2.connect(
    dbname="svdemo",
    user="postgres",
    password="redacted",
    host="simvec",
    port="8085"
)

cursor = conn.cursor()

fake = Faker()

def generate_random_image():
    width, height = 100, 100 
    image = Image.new("RGB", (width, height))

    pixels = [(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)) for _ in range(width * height)]
    image.putdata(pixels)

    image_io = BytesIO()
    image.save(image_io, format="PNG")

    return image_io.getvalue()

num_users = 10

for _ in range(num_users):
    username = fake.user_name()
    password = fake.password()

    cursor.execute("INSERT INTO user_data (username, password) VALUES (%s, %s) RETURNING id", (username, password))
    user_id = cursor.fetchone()[0]

    num_images = random.randint(1, 40) 
    for i in range(num_images):
        image_data = generate_random_image()

        cursor.execute(
            "INSERT INTO image_metadata (user_id, image_name) VALUES (%s, %s) RETURNING id",
            (user_id, f"{username}_image_{i + 1}.png")
        )
        image_id = cursor.fetchone()[0]

        cursor.execute("UPDATE user_data SET images[%s] = %s WHERE id = %s", (i + 1, image_data, user_id))

conn.commit()

cursor.close()
conn.close()
