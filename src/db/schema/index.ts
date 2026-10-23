import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["CUSTOMER", "ADMIN"]);
export const orderStatusEnum = pgEnum("order_status", [
  "NEW",
  "CONFIRMED",
  "WAITING_STOCK",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
export const paymentMethodEnum = pgEnum("payment_method", ["CASH_ON_DELIVERY"]);
export const articleStatusEnum = pgEnum("article_status", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);
export const contentStatusEnum = pgEnum("content_status", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);
export const stockStatusEnum = pgEnum("stock_status", [
  "IN_STOCK",
  "LOW_STOCK",
  "MADE_TO_ORDER",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

/* ─── Better Auth + app user ─── */

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: userRoleEnum("role").default("CUSTOMER").notNull(),
    phone: varchar("phone", { length: 32 }),
    banned: boolean("banned").default(false).notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_uidx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("sessions_token_uidx").on(t.token),
    index("sessions_user_idx").on(t.userId),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [index("accounts_user_idx").on(t.userId)],
);

export const verifications = pgTable("verifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
});

/* ─── Addresses ─── */

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 80 }),
    fullName: text("full_name").notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    county: varchar("county", { length: 80 }).notNull(),
    city: varchar("city", { length: 120 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }),
    streetLine: text("street_line").notNull(),
    details: text("details"),
    isDefault: boolean("is_default").default(false).notNull(),
    ...timestamps,
  },
  (t) => [index("addresses_user_idx").on(t.userId)],
);

/* ─── Catalog ─── */

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    shortDescription: text("short_description"),
    heroTitle: text("hero_title"),
    heroDescription: text("hero_description"),
    imageKey: text("image_key"),
    visualTheme: jsonb("visual_theme").$type<{
      gradientSeed?: string;
      accent?: string;
    }>(),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("categories_slug_uidx").on(t.slug),
    index("categories_active_sort_idx").on(t.isActive, t.sortOrder),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    sku: varchar("sku", { length: 64 }).notNull(),
    shortDescription: text("short_description"),
    description: text("description"),
    story: text("story"),
    usageInstructions: text("usage_instructions"),
    /** Price in bani (integer). */
    priceBani: integer("price_bani").notNull(),
    compareAtPriceBani: integer("compare_at_price_bani"),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    stockStatus: stockStatusEnum("stock_status").default("MADE_TO_ORDER").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isPopular: boolean("is_popular").default(false).notNull(),
    mainImageKey: text("main_image_key"),
    gallery: jsonb("gallery").$type<string[]>().default([]),
    metadata: jsonb("metadata").$type<Record<string, string>>().default({}),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("products_slug_uidx").on(t.slug),
    uniqueIndex("products_sku_uidx").on(t.sku),
    index("products_category_idx").on(t.categoryId),
    index("products_active_featured_idx").on(t.isActive, t.isFeatured),
    index("products_active_popular_idx").on(t.isActive, t.isPopular),
  ],
);

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    reason: text("reason").notNull(),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    note: text("note"),
    ...timestamps,
  },
  (t) => [index("inventory_product_idx").on(t.productId)],
);

/* ─── Content ─── */

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    /** TipTap JSON document */
    content: jsonb("content").$type<Record<string, unknown>>().notNull().default({}),
    coverImageKey: text("cover_image_key"),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    authorName: text("author_name").default("LyraBaits"),
    status: articleStatusEnum("status").default("DRAFT").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("articles_slug_uidx").on(t.slug),
    index("articles_status_published_idx").on(t.status, t.publishedAt),
  ],
);

export const shows = pgTable(
  "shows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    shortDescription: text("short_description"),
    coverImageKey: text("cover_image_key"),
    heroImageKey: text("hero_image_key"),
    status: contentStatusEnum("status").default("DRAFT").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("shows_slug_uidx").on(t.slug),
    index("shows_status_sort_idx").on(t.status, t.sortOrder),
  ],
);

export const episodes = pgTable(
  "episodes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    showId: uuid("show_id")
      .notNull()
      .references(() => shows.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    episodeNumber: integer("episode_number").notNull(),
    seasonNumber: integer("season_number"),
    thumbnailKey: text("thumbnail_key"),
    videoUrl: text("video_url"),
    videoProvider: varchar("video_provider", { length: 40 }),
    durationSeconds: integer("duration_seconds"),
    status: contentStatusEnum("status").default("DRAFT").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("episodes_show_slug_uidx").on(t.showId, t.slug),
    index("episodes_show_number_idx").on(t.showId, t.episodeNumber),
  ],
);

/* ─── Orders ─── */

export const orderSequences = pgTable("order_sequences", {
  year: integer("year").primaryKey(),
  lastValue: integer("last_value").default(0).notNull(),
});

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 32 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    status: orderStatusEnum("status").default("NEW").notNull(),
    paymentMethod: paymentMethodEnum("payment_method")
      .default("CASH_ON_DELIVERY")
      .notNull(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: varchar("customer_phone", { length: 32 }).notNull(),
    shippingCounty: varchar("shipping_county", { length: 80 }).notNull(),
    shippingCity: varchar("shipping_city", { length: 120 }).notNull(),
    shippingPostalCode: varchar("shipping_postal_code", { length: 20 }),
    shippingStreetLine: text("shipping_street_line").notNull(),
    shippingDetails: text("shipping_details"),
    notes: text("notes"),
    subtotalBani: integer("subtotal_bani").notNull(),
    totalBani: integer("total_bani").notNull(),
    requiresDeliveryConfirmation: boolean("requires_delivery_confirmation")
      .default(false)
      .notNull(),
    termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("orders_number_uidx").on(t.orderNumber),
    index("orders_status_created_idx").on(t.status, t.createdAt),
    index("orders_email_idx").on(t.customerEmail),
    index("orders_user_idx").on(t.userId),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    productSlug: text("product_slug").notNull(),
    sku: varchar("sku", { length: 64 }).notNull(),
    unitPriceBani: integer("unit_price_bani").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotalBani: integer("line_total_bani").notNull(),
    stockAtOrder: integer("stock_at_order").notNull(),
    requiresDeliveryConfirmation: boolean("requires_delivery_confirmation")
      .default(false)
      .notNull(),
    ...timestamps,
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fromStatus: orderStatusEnum("from_status"),
    toStatus: orderStatusEnum("to_status").notNull(),
    note: text("note"),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [index("order_status_history_order_idx").on(t.orderId)],
);

/* ─── Contact & settings ─── */

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 32 }),
  subject: text("subject"),
  message: text("message").notNull(),
  ipHash: text("ip_hash"),
  ...timestamps,
});

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* ─── Relations ─── */

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  inventoryMovements: many(inventoryMovements),
}));

export const inventoryMovementsRelations = relations(inventoryMovements, ({ one }) => ({
  product: one(products, {
    fields: [inventoryMovements.productId],
    references: [products.id],
  }),
}));

export const showsRelations = relations(shows, ({ many }) => ({
  episodes: many(episodes),
}));

export const episodesRelations = relations(episodes, ({ one }) => ({
  show: one(shows, {
    fields: [episodes.showId],
    references: [shows.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
