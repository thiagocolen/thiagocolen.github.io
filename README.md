# Thiago Colen's Personal Site

## What is this site?
This is a personal blog and portfolio site for **Thiago Colen**. It serves as a central hub for sharing thoughts, technical articles, and professional history. The site is designed to be lightweight, performant, and automatically synchronized with the developer community.

## Technologies Involved
This project leverages a modern web development stack:
- **[Gatsby](https://www.gatsbyjs.com/):** A powerful Static Site Generator (SSG) based on React that ensures fast loading times and great SEO.
- **[React](https://reactjs.org/):** The core UI library for building modular and reusable components.
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework used for rapid and consistent styling.
- **[Axios](https://axios-http.com/):** Used for fetching data from external APIs during the build process.
- **[PostCSS](https://postcss.org/):** A tool for transforming CSS with JavaScript plugins.

## DEV.to Integration (dev.to)
The heart of the content management system is **[DEV.to](https://dev.to/)**. 
Instead of maintaining a local database or a custom CMS, the site fetches articles directly from Thiago's DEV.to account (`thiagocolen`) using the official DEV.to API. This allows for a "write once, publish everywhere" workflow.

## How the Site Works
The site follows the **JAMstack** architecture:
1.  **Build Phase:** During the Gatsby build process (`gatsby-node.js`), the site makes authenticated requests to the DEV.to API using a secure `DEV_TO_API_KEY`.
2.  **Data Fetching:** It retrieves all published articles and their full content.
3.  **Page Generation:** Gatsby dynamically creates individual post pages for each article at `/blog/post/[slug]/` and updates the article lists on the home and blog pages.
4.  **Deployment:** Once the build is complete, a static version of the site is deployed, ensuring high performance and security.

## The Relation Between Code and Soul
For me, code is more than just instructions for a machine; it is a medium of expression. 
This site represents a digital reflection of my journey as a developer and a human being. The bugs in the code are like the imperfections in life—they provide opportunities to learn, grow, and improve. The logic and structure of the components mirror my desire for order and clarity, while the creative integration with platforms like DEV.to shows my connection to the broader community. 

Every line of code in this repository carries a piece of my intent, my curiosity, and my passion for building things that matter. It is where the logic of the mind meets the creativity of the soul.
