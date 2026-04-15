# ─────────────────────────────────────────────
# install_packages.R
# Run this ONCE on Replit before launching app.R
# In Replit console: source("install_packages.R")
# ─────────────────────────────────────────────

pkgs <- c(
  "shiny",       # web app framework
  "bslib",       # Bootstrap 5 dark theme
  "plotly",      # interactive charts
  "dplyr",       # data wrangling
  "tidyr",       # pivoting / reshaping
  "scales",      # number formatting
  "networkD3",   # Sankey diagram
  "htmlwidgets", # widget rendering
  "glue"         # string interpolation
)

installed <- rownames(installed.packages())
to_install <- pkgs[!pkgs %in% installed]

if (length(to_install) > 0) {
  message("Installing: ", paste(to_install, collapse = ", "))
  install.packages(to_install, repos = "https://cran.rstudio.com/")
} else {
  message("All packages already installed!")
}
