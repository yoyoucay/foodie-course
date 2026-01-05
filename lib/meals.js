import fs from "node:fs";
import { sql } from "@vercel/postgres";
import slugify from "slugify";
import xss from "xss";
import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: 'ap-southeast-2'
});

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // throw new Error('Failed to fetch meals.');
  const { rows } = await sql`SELECT * FROM meals`;
  return rows;
}

export async function getMeal(slug) {
  const { rows } = await sql`SELECT * FROM meals WHERE slug = ${slug}`;
  return rows[0];
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  s3.putObject({
    Bucket: 'foodie-course-image',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = fileName;

  await sql`
    INSERT INTO meals 
      (title, summary, instructions, creator, creator_email, image, slug) 
    VALUES (
      ${meal.title},
      ${meal.summary},
      ${meal.instructions},
      ${meal.creator},
      ${meal.creator_email},
      ${meal.image},
      ${meal.slug}
    )
  `;
}
