const fetch = require('node-fetch');

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyQuery(query, variables = {}) {
  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0]?.message || 'Shopify GraphQL error');
  }
  return data.data;
}

async function searchProducts({ keywords = [], category = null, budget = null, first = 6 }) {
  const searchQuery = [
    ...(keywords || []),
    category ? category : '',
  ].filter(Boolean).join(' ');

  const query = `
    query SearchProducts($query: String!, $first: Int!) {
      products(query: $query, first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            vendor
            productType
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 3) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyQuery(query, { query: searchQuery || 'product', first });
    let products = data.products.edges.map(({ node }) => formatProduct(node));

    // Filter by budget if provided
    if (budget) {
      products = products.filter(p => parseFloat(p.price) <= budget);
    }

    return products;
  } catch (err) {
    console.error('Shopify search error:', err.message);
    return [];
  }
}

async function getAllProducts(first = 8) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            vendor
            productType
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyQuery(query, { first });
    return data.products.edges.map(({ node }) => formatProduct(node));
  } catch (err) {
    console.error('Shopify get products error:', err.message);
    return [];
  }
}

function formatProduct(node) {
  const image = node.images?.edges?.[0]?.node;
  const firstVariant = node.variants?.edges?.[0]?.node;
  const price = node.priceRange?.minVariantPrice?.amount || firstVariant?.price?.amount || '0';
  const currency = node.priceRange?.minVariantPrice?.currencyCode || 'USD';

  return {
    id: node.id,
    title: node.title,
    description: node.description?.substring(0, 150) || '',
    handle: node.handle,
    vendor: node.vendor,
    type: node.productType,
    tags: node.tags || [],
    price: parseFloat(price).toFixed(2),
    currency,
    image: image?.url || null,
    imageAlt: image?.altText || node.title,
    variantId: firstVariant?.id || null,
    available: firstVariant?.availableForSale ?? true,
  };
}

module.exports = { searchProducts, getAllProducts };
