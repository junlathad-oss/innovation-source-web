import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('th', 'en');
  CREATE TYPE "public"."enum_brands_kind" AS ENUM('authorized', 'partner', 'group');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'in-progress', 'quoted', 'closed');
  CREATE TYPE "public"."enum_home_page_blocks_hero_trust_icon" AS ENUM('shield', 'truck', 'support', 'chip');
  CREATE TYPE "public"."enum_home_page_blocks_logo_wall_style" AS ENUM('cards', 'logos');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_blocks_hero_trust_icon" AS ENUM('shield', 'truck', 'support', 'chip');
  CREATE TYPE "public"."enum__home_page_v_blocks_logo_wall_style" AS ENUM('cards', 'logos');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_published_locale" AS ENUM('th', 'en');
  CREATE TABLE "products_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "products_specs_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"part_number" varchar,
  	"slug" varchar,
  	"category_id" integer NOT NULL,
  	"brand_id" integer,
  	"datasheet_id" integer,
  	"featured" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar NOT NULL,
  	"summary" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"image_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"logo_id" integer,
  	"kind" "enum_brands_kind" DEFAULT 'authorized',
  	"since" numeric,
  	"url" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "brands_locales" (
  	"origin" varchar,
  	"tagline" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "brands_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"company" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer,
  	"media_id" integer,
  	"inquiries_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_hero_trust" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_page_blocks_hero_trust_icon" DEFAULT 'shield'
  );
  
  CREATE TABLE "home_page_blocks_hero_trust_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"primary_cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"image_id" integer,
  	"video_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_hero_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"subtitle" varchar,
  	"primary_cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_page_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_category_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"dark" boolean,
  	"link_href" varchar
  );
  
  CREATE TABLE "home_page_blocks_solutions_items_locales" (
  	"title" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_industries_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "home_page_blocks_industries_items_locales" (
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_industries_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "home_page_blocks_timeline_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_timeline_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_home_page_blocks_logo_wall_style" DEFAULT 'cards',
  	"eyebrow" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_logo_wall_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_cta_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "_home_page_v_blocks_hero_trust" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__home_page_v_blocks_hero_trust_icon" DEFAULT 'shield',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_hero_trust_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"image_id" integer,
  	"video_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_hero_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"subtitle" varchar,
  	"primary_cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_category_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"dark" boolean,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_solutions_items_locales" (
  	"title" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_industries_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_industries_items_locales" (
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_industries_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_timeline_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_timeline_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__home_page_v_blocks_logo_wall_style" DEFAULT 'cards',
  	"eyebrow" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_logo_wall_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_cta_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_home_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"group_name" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"line_id" varchar,
  	"map_url" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"company_name" varchar NOT NULL,
  	"address" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "header_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "products_specs" ADD CONSTRAINT "products_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_locales" ADD CONSTRAINT "products_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_datasheet_id_media_id_fk" FOREIGN KEY ("datasheet_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_locales" ADD CONSTRAINT "brands_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero_trust" ADD CONSTRAINT "home_page_blocks_hero_trust_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero_trust_locales" ADD CONSTRAINT "home_page_blocks_hero_trust_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero_trust"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero_locales" ADD CONSTRAINT "home_page_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_stats_items" ADD CONSTRAINT "home_page_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_stats_items_locales" ADD CONSTRAINT "home_page_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_stats" ADD CONSTRAINT "home_page_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_category_grid" ADD CONSTRAINT "home_page_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_category_grid_locales" ADD CONSTRAINT "home_page_blocks_category_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_category_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_solutions_items" ADD CONSTRAINT "home_page_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_solutions_items_locales" ADD CONSTRAINT "home_page_blocks_solutions_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_solutions_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_solutions" ADD CONSTRAINT "home_page_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_industries_items" ADD CONSTRAINT "home_page_blocks_industries_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_industries_items_locales" ADD CONSTRAINT "home_page_blocks_industries_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_industries_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_industries" ADD CONSTRAINT "home_page_blocks_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_industries_locales" ADD CONSTRAINT "home_page_blocks_industries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_timeline_items" ADD CONSTRAINT "home_page_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_timeline_items_locales" ADD CONSTRAINT "home_page_blocks_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_timeline" ADD CONSTRAINT "home_page_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_timeline_locales" ADD CONSTRAINT "home_page_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_logo_wall" ADD CONSTRAINT "home_page_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_logo_wall_locales" ADD CONSTRAINT "home_page_blocks_logo_wall_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_cta" ADD CONSTRAINT "home_page_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_cta_locales" ADD CONSTRAINT "home_page_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero_trust" ADD CONSTRAINT "_home_page_v_blocks_hero_trust_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero_trust_locales" ADD CONSTRAINT "_home_page_v_blocks_hero_trust_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero_trust"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero" ADD CONSTRAINT "_home_page_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero" ADD CONSTRAINT "_home_page_v_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero" ADD CONSTRAINT "_home_page_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero_locales" ADD CONSTRAINT "_home_page_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_stats_items" ADD CONSTRAINT "_home_page_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_stats_items_locales" ADD CONSTRAINT "_home_page_v_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_stats" ADD CONSTRAINT "_home_page_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_category_grid" ADD CONSTRAINT "_home_page_v_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_category_grid_locales" ADD CONSTRAINT "_home_page_v_blocks_category_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_category_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_solutions_items" ADD CONSTRAINT "_home_page_v_blocks_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_solutions_items_locales" ADD CONSTRAINT "_home_page_v_blocks_solutions_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_solutions_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_solutions" ADD CONSTRAINT "_home_page_v_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_industries_items" ADD CONSTRAINT "_home_page_v_blocks_industries_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_industries_items_locales" ADD CONSTRAINT "_home_page_v_blocks_industries_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_industries_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_industries" ADD CONSTRAINT "_home_page_v_blocks_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_industries_locales" ADD CONSTRAINT "_home_page_v_blocks_industries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_timeline_items" ADD CONSTRAINT "_home_page_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_timeline_items_locales" ADD CONSTRAINT "_home_page_v_blocks_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_timeline" ADD CONSTRAINT "_home_page_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_timeline_locales" ADD CONSTRAINT "_home_page_v_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_logo_wall" ADD CONSTRAINT "_home_page_v_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_logo_wall_locales" ADD CONSTRAINT "_home_page_v_blocks_logo_wall_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_cta" ADD CONSTRAINT "_home_page_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_cta_locales" ADD CONSTRAINT "_home_page_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav" ADD CONSTRAINT "header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_locales" ADD CONSTRAINT "header_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal" ADD CONSTRAINT "footer_legal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_locales" ADD CONSTRAINT "footer_legal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_specs_order_idx" ON "products_specs" USING btree ("_order");
  CREATE INDEX "products_specs_parent_id_idx" ON "products_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specs_locales_locale_parent_id_unique" ON "products_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specs_locales_parent_id_idx" ON "products_specs_locales" USING btree ("_parent_id");
  CREATE INDEX "products_part_number_idx" ON "products" USING btree ("part_number");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");
  CREATE INDEX "products_datasheet_idx" ON "products" USING btree ("datasheet_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE UNIQUE INDEX "brands_locales_locale_parent_id_unique" ON "brands_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_locales_parent_id_idx" ON "brands_locales" USING btree ("_parent_id");
  CREATE INDEX "brands_rels_order_idx" ON "brands_rels" USING btree ("order");
  CREATE INDEX "brands_rels_parent_idx" ON "brands_rels" USING btree ("parent_id");
  CREATE INDEX "brands_rels_path_idx" ON "brands_rels" USING btree ("path");
  CREATE INDEX "brands_rels_categories_id_idx" ON "brands_rels" USING btree ("categories_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_blocks_hero_trust_order_idx" ON "home_page_blocks_hero_trust" USING btree ("_order");
  CREATE INDEX "home_page_blocks_hero_trust_parent_id_idx" ON "home_page_blocks_hero_trust" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_blocks_hero_trust_locales_locale_parent_id_unique" ON "home_page_blocks_hero_trust_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_hero_trust_locales_parent_id_idx" ON "home_page_blocks_hero_trust_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_hero_order_idx" ON "home_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "home_page_blocks_hero_parent_id_idx" ON "home_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_hero_path_idx" ON "home_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "home_page_blocks_hero_image_idx" ON "home_page_blocks_hero" USING btree ("image_id");
  CREATE INDEX "home_page_blocks_hero_video_idx" ON "home_page_blocks_hero" USING btree ("video_id");
  CREATE UNIQUE INDEX "home_page_blocks_hero_locales_locale_parent_id_unique" ON "home_page_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_hero_locales_parent_id_idx" ON "home_page_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_stats_items_order_idx" ON "home_page_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "home_page_blocks_stats_items_parent_id_idx" ON "home_page_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_blocks_stats_items_locales_locale_parent_id_unique" ON "home_page_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_stats_items_locales_parent_id_idx" ON "home_page_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_stats_order_idx" ON "home_page_blocks_stats" USING btree ("_order");
  CREATE INDEX "home_page_blocks_stats_parent_id_idx" ON "home_page_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_stats_path_idx" ON "home_page_blocks_stats" USING btree ("_path");
  CREATE INDEX "home_page_blocks_category_grid_order_idx" ON "home_page_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "home_page_blocks_category_grid_parent_id_idx" ON "home_page_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_category_grid_path_idx" ON "home_page_blocks_category_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "home_page_blocks_category_grid_locales_locale_parent_id_uniq" ON "home_page_blocks_category_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_category_grid_locales_parent_id_idx" ON "home_page_blocks_category_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_solutions_items_order_idx" ON "home_page_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "home_page_blocks_solutions_items_parent_id_idx" ON "home_page_blocks_solutions_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_blocks_solutions_items_locales_locale_parent_id_un" ON "home_page_blocks_solutions_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_solutions_items_locales_parent_id_idx" ON "home_page_blocks_solutions_items_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_solutions_order_idx" ON "home_page_blocks_solutions" USING btree ("_order");
  CREATE INDEX "home_page_blocks_solutions_parent_id_idx" ON "home_page_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_solutions_path_idx" ON "home_page_blocks_solutions" USING btree ("_path");
  CREATE INDEX "home_page_blocks_industries_items_order_idx" ON "home_page_blocks_industries_items" USING btree ("_order");
  CREATE INDEX "home_page_blocks_industries_items_parent_id_idx" ON "home_page_blocks_industries_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_blocks_industries_items_locales_locale_parent_id_u" ON "home_page_blocks_industries_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_industries_items_locales_parent_id_idx" ON "home_page_blocks_industries_items_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_industries_order_idx" ON "home_page_blocks_industries" USING btree ("_order");
  CREATE INDEX "home_page_blocks_industries_parent_id_idx" ON "home_page_blocks_industries" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_industries_path_idx" ON "home_page_blocks_industries" USING btree ("_path");
  CREATE UNIQUE INDEX "home_page_blocks_industries_locales_locale_parent_id_unique" ON "home_page_blocks_industries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_industries_locales_parent_id_idx" ON "home_page_blocks_industries_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_timeline_items_order_idx" ON "home_page_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "home_page_blocks_timeline_items_parent_id_idx" ON "home_page_blocks_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_blocks_timeline_items_locales_locale_parent_id_uni" ON "home_page_blocks_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_timeline_items_locales_parent_id_idx" ON "home_page_blocks_timeline_items_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_timeline_order_idx" ON "home_page_blocks_timeline" USING btree ("_order");
  CREATE INDEX "home_page_blocks_timeline_parent_id_idx" ON "home_page_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_timeline_path_idx" ON "home_page_blocks_timeline" USING btree ("_path");
  CREATE UNIQUE INDEX "home_page_blocks_timeline_locales_locale_parent_id_unique" ON "home_page_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_timeline_locales_parent_id_idx" ON "home_page_blocks_timeline_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_logo_wall_order_idx" ON "home_page_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "home_page_blocks_logo_wall_parent_id_idx" ON "home_page_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_logo_wall_path_idx" ON "home_page_blocks_logo_wall" USING btree ("_path");
  CREATE UNIQUE INDEX "home_page_blocks_logo_wall_locales_locale_parent_id_unique" ON "home_page_blocks_logo_wall_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_logo_wall_locales_parent_id_idx" ON "home_page_blocks_logo_wall_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_cta_order_idx" ON "home_page_blocks_cta" USING btree ("_order");
  CREATE INDEX "home_page_blocks_cta_parent_id_idx" ON "home_page_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_cta_path_idx" ON "home_page_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "home_page_blocks_cta_locales_locale_parent_id_unique" ON "home_page_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_blocks_cta_locales_parent_id_idx" ON "home_page_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_categories_id_idx" ON "home_page_rels" USING btree ("categories_id");
  CREATE INDEX "home_page_rels_brands_id_idx" ON "home_page_rels" USING btree ("brands_id");
  CREATE INDEX "_home_page_v_blocks_hero_trust_order_idx" ON "_home_page_v_blocks_hero_trust" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_hero_trust_parent_id_idx" ON "_home_page_v_blocks_hero_trust" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_blocks_hero_trust_locales_locale_parent_id_uniq" ON "_home_page_v_blocks_hero_trust_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_trust_locales_parent_id_idx" ON "_home_page_v_blocks_hero_trust_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_order_idx" ON "_home_page_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_hero_parent_id_idx" ON "_home_page_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_path_idx" ON "_home_page_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_hero_image_idx" ON "_home_page_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_home_page_v_blocks_hero_video_idx" ON "_home_page_v_blocks_hero" USING btree ("video_id");
  CREATE UNIQUE INDEX "_home_page_v_blocks_hero_locales_locale_parent_id_unique" ON "_home_page_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_locales_parent_id_idx" ON "_home_page_v_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_stats_items_order_idx" ON "_home_page_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_stats_items_parent_id_idx" ON "_home_page_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_blocks_stats_items_locales_locale_parent_id_uni" ON "_home_page_v_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_stats_items_locales_parent_id_idx" ON "_home_page_v_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_stats_order_idx" ON "_home_page_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_stats_parent_id_idx" ON "_home_page_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_stats_path_idx" ON "_home_page_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_category_grid_order_idx" ON "_home_page_v_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_category_grid_parent_id_idx" ON "_home_page_v_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_category_grid_path_idx" ON "_home_page_v_blocks_category_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_page_v_blocks_category_grid_locales_locale_parent_id_u" ON "_home_page_v_blocks_category_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_category_grid_locales_parent_id_idx" ON "_home_page_v_blocks_category_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_solutions_items_order_idx" ON "_home_page_v_blocks_solutions_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_solutions_items_parent_id_idx" ON "_home_page_v_blocks_solutions_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_blocks_solutions_items_locales_locale_parent_id" ON "_home_page_v_blocks_solutions_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_solutions_items_locales_parent_id_idx" ON "_home_page_v_blocks_solutions_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_solutions_order_idx" ON "_home_page_v_blocks_solutions" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_solutions_parent_id_idx" ON "_home_page_v_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_solutions_path_idx" ON "_home_page_v_blocks_solutions" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_industries_items_order_idx" ON "_home_page_v_blocks_industries_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_industries_items_parent_id_idx" ON "_home_page_v_blocks_industries_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_blocks_industries_items_locales_locale_parent_i" ON "_home_page_v_blocks_industries_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_industries_items_locales_parent_id_idx" ON "_home_page_v_blocks_industries_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_industries_order_idx" ON "_home_page_v_blocks_industries" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_industries_parent_id_idx" ON "_home_page_v_blocks_industries" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_industries_path_idx" ON "_home_page_v_blocks_industries" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_page_v_blocks_industries_locales_locale_parent_id_uniq" ON "_home_page_v_blocks_industries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_industries_locales_parent_id_idx" ON "_home_page_v_blocks_industries_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_timeline_items_order_idx" ON "_home_page_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_timeline_items_parent_id_idx" ON "_home_page_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_blocks_timeline_items_locales_locale_parent_id_" ON "_home_page_v_blocks_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_timeline_items_locales_parent_id_idx" ON "_home_page_v_blocks_timeline_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_timeline_order_idx" ON "_home_page_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_timeline_parent_id_idx" ON "_home_page_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_timeline_path_idx" ON "_home_page_v_blocks_timeline" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_page_v_blocks_timeline_locales_locale_parent_id_unique" ON "_home_page_v_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_timeline_locales_parent_id_idx" ON "_home_page_v_blocks_timeline_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_logo_wall_order_idx" ON "_home_page_v_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_logo_wall_parent_id_idx" ON "_home_page_v_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_logo_wall_path_idx" ON "_home_page_v_blocks_logo_wall" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_page_v_blocks_logo_wall_locales_locale_parent_id_uniqu" ON "_home_page_v_blocks_logo_wall_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_logo_wall_locales_parent_id_idx" ON "_home_page_v_blocks_logo_wall_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_cta_order_idx" ON "_home_page_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_cta_parent_id_idx" ON "_home_page_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_cta_path_idx" ON "_home_page_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_page_v_blocks_cta_locales_locale_parent_id_unique" ON "_home_page_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_blocks_cta_locales_parent_id_idx" ON "_home_page_v_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_snapshot_idx" ON "_home_page_v" USING btree ("snapshot");
  CREATE INDEX "_home_page_v_published_locale_idx" ON "_home_page_v" USING btree ("published_locale");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_rels_order_idx" ON "_home_page_v_rels" USING btree ("order");
  CREATE INDEX "_home_page_v_rels_parent_idx" ON "_home_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_rels_path_idx" ON "_home_page_v_rels" USING btree ("path");
  CREATE INDEX "_home_page_v_rels_categories_id_idx" ON "_home_page_v_rels" USING btree ("categories_id");
  CREATE INDEX "_home_page_v_rels_brands_id_idx" ON "_home_page_v_rels" USING btree ("brands_id");
  CREATE INDEX "site_settings_seo_seo_image_idx" ON "site_settings" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "header_nav_order_idx" ON "header_nav" USING btree ("_order");
  CREATE INDEX "header_nav_parent_id_idx" ON "header_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_locales_locale_parent_id_unique" ON "header_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_nav_locales_parent_id_idx" ON "header_nav_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_locales_parent_id_idx" ON "header_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_locales_parent_id_idx" ON "footer_columns_links_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_locales_parent_id_idx" ON "footer_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_order_idx" ON "footer_legal" USING btree ("_order");
  CREATE INDEX "footer_legal_parent_id_idx" ON "footer_legal" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_legal_locales_locale_parent_id_unique" ON "footer_legal_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_locales_parent_id_idx" ON "footer_legal_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_specs" CASCADE;
  DROP TABLE "products_specs_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "brands_locales" CASCADE;
  DROP TABLE "brands_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_blocks_hero_trust" CASCADE;
  DROP TABLE "home_page_blocks_hero_trust_locales" CASCADE;
  DROP TABLE "home_page_blocks_hero" CASCADE;
  DROP TABLE "home_page_blocks_hero_locales" CASCADE;
  DROP TABLE "home_page_blocks_stats_items" CASCADE;
  DROP TABLE "home_page_blocks_stats_items_locales" CASCADE;
  DROP TABLE "home_page_blocks_stats" CASCADE;
  DROP TABLE "home_page_blocks_category_grid" CASCADE;
  DROP TABLE "home_page_blocks_category_grid_locales" CASCADE;
  DROP TABLE "home_page_blocks_solutions_items" CASCADE;
  DROP TABLE "home_page_blocks_solutions_items_locales" CASCADE;
  DROP TABLE "home_page_blocks_solutions" CASCADE;
  DROP TABLE "home_page_blocks_industries_items" CASCADE;
  DROP TABLE "home_page_blocks_industries_items_locales" CASCADE;
  DROP TABLE "home_page_blocks_industries" CASCADE;
  DROP TABLE "home_page_blocks_industries_locales" CASCADE;
  DROP TABLE "home_page_blocks_timeline_items" CASCADE;
  DROP TABLE "home_page_blocks_timeline_items_locales" CASCADE;
  DROP TABLE "home_page_blocks_timeline" CASCADE;
  DROP TABLE "home_page_blocks_timeline_locales" CASCADE;
  DROP TABLE "home_page_blocks_logo_wall" CASCADE;
  DROP TABLE "home_page_blocks_logo_wall_locales" CASCADE;
  DROP TABLE "home_page_blocks_cta" CASCADE;
  DROP TABLE "home_page_blocks_cta_locales" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero_trust" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero_trust_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_stats_items" CASCADE;
  DROP TABLE "_home_page_v_blocks_stats_items_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_stats" CASCADE;
  DROP TABLE "_home_page_v_blocks_category_grid" CASCADE;
  DROP TABLE "_home_page_v_blocks_category_grid_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_solutions_items" CASCADE;
  DROP TABLE "_home_page_v_blocks_solutions_items_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_solutions" CASCADE;
  DROP TABLE "_home_page_v_blocks_industries_items" CASCADE;
  DROP TABLE "_home_page_v_blocks_industries_items_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_industries" CASCADE;
  DROP TABLE "_home_page_v_blocks_industries_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_home_page_v_blocks_timeline_items_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_timeline" CASCADE;
  DROP TABLE "_home_page_v_blocks_timeline_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_logo_wall" CASCADE;
  DROP TABLE "_home_page_v_blocks_logo_wall_locales" CASCADE;
  DROP TABLE "_home_page_v_blocks_cta" CASCADE;
  DROP TABLE "_home_page_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "_home_page_v_rels" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "header_nav" CASCADE;
  DROP TABLE "header_nav_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_legal" CASCADE;
  DROP TABLE "footer_legal_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_brands_kind";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_home_page_blocks_hero_trust_icon";
  DROP TYPE "public"."enum_home_page_blocks_logo_wall_style";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_blocks_hero_trust_icon";
  DROP TYPE "public"."enum__home_page_v_blocks_logo_wall_style";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum__home_page_v_published_locale";`)
}
