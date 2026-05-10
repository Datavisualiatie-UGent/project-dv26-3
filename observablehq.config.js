// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Project Datavisualisatie",
  root: "src",   // The path to the source root.
  //theme: "glacier",
  // brain world foto als favicon
  head: `<link rel="icon" href="assets/brain-world.jpg" type="image/jpeg" sizes="32x32">
  <link rel="stylesheet" href="/styles.css">
  `,
  theme: "glacier",
  pager: true,
  header: `<nav class="navbar">
      <div class="nav-container">
        <a class="nav-logo" href="/">Mental Health Insights</a>
        <div class="nav-links">
          <a href="/comparison">Comparison</a>
          <a href="/men-women">Social Factors</a>
        </div>
      </div>
    </nav>`, 

  footer: "", 
  sidebar: false
};

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],


  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs

