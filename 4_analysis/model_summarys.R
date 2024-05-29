modelsummary(mods[1],
             stars = TRUE,
             statistic =c("[{conf.low}, {conf.high}]",
                                        "{std.error}",
                                        "{statistic}",
                                        "{p.value}"),
             coef_omit = "SD|Cor",
             # shape = model + term ~ statistic,
             gof_map = gm)

gm <- c("nobs", "r2.conditional", "r2.marginal")

# gm <- tibble::tribble(
#   ~raw,        ~clean,          ~fmt,
#   "nobs",      "N",             0,
#   "r.squared", "R<sup>2</sup>", 2)

library(modelsummary)
options(modelsummary_model_labels = "roman")
options(modelsummary_format_numeric_latex = "mathmode")
modelsummary(mods,escape = FALSE,
             coef_rename = coef_names,
             statistic = NULL,
             # statistic = c("CI = [{conf.low}, {conf.high}]"),
             # effects = "fixed",
             estimate = "{estimate}{stars} [{conf.low}, {conf.high}] ",
             coef_omit = "SD|Cor",
             shape = "rbind",
             shape = model + term ~ statistic + gof,
             # mt = 1,
             gof_map = gm,
             # output = 'table.tex'
             )

models <- list(
  mpg = lm(mpg ~ cyl + disp, mtcars),
  hp = lm(hp ~ cyl + disp, mtcars))



ti <- data.frame(
  term = c("coef1", "coef2", "coef3"),
  estimate = 1:3,
  std.error = c(pi, exp(1), sqrt(2)))

gl <- data.frame(
  stat1 = "blah",
  stat2 = "blah blah")

ti = parameters(mods[[1]])
gl = performance::model_performance(mods[[1]])

mod <- list(
  tidy = ti,
  glance = gl)

class(mod) <- "modelsummary_list"

modelsummary(mod)

# add custom functions to extract estimates (tidy) and goodness-of-fit (glance) information
tidy.glmmTMB <- function(x, ...) {
  s <- summary(x, ...)
  ret <- data.frame(
    term      = row.names(s$solutions),
    estimate  = s$solutions[, 1],
    conf.low  = s$solutions[, 2],
    conf.high = s$solutions[, 3])
  ret
}

glance.glmmTMB <- function(x, ...) {
  ret <- data.frame(
    dic = x$DIC,
    n   = nrow(x$X))
  ret
}

parameters(mods[[1]]) %>% filter(Effects == "fixed")


modelsummary(models,
             statistic = NULL,
             estimate = "{estimate}{stars} {std.error} [{conf.low}, {conf.high}] ",
             shape = "rcollapse",
             gof_map = c("nobs", "r.squared"))


coef_names <-  c(
  "log1p(video_mean_pedcounts)" = "Ped. Counts",
  "Typologygreen" = "Green",

  "Structure:Typologygreen" = "Structure x Green",
  "Beauty:Typologygreen" = "Beauty x Green",
  "Width:Typologygreen" = "Width x Green",
  "Scenic:Typologygreen" = "Scenic x Green",

  "log1p(video_mean_pedcounts):Typologygreen"= "Ped. Counts x Green",
  "log1p(video_mean_pedcounts):Beauty" = "Ped. Counts x Beauty",
  "log1p(video_mean_pedcounts):Scenic" = "Ped. Counts x Scenic",
  "log1p(video_mean_pedcounts):Width" = "Ped. Counts x Width",
  "log1p(video_mean_pedcounts):Structure" = "Ped. Counts x Structure",

  "log1p(video_mean_pedcounts):Scenic:Typologygreen" = "Ped. Counts x Scenic x Green",
  "log1p(video_mean_pedcounts):Width:Typologygreen" = "Ped. Counts x Width x Green",
  "log1p(video_mean_pedcounts):Structure:Typologygreen" = "Ped. Counts x Structure x Green",
  "log1p(video_mean_pedcounts):Beauty:Typologygreen" = "Ped. Counts x Beauty x Green"
)

t <- parameters(mods[[1]]) %>% filter(Effects == "fixed")

for (i in 1:length(mods) ) {
  if(i == 1 ) {
    tab_models = data.frame()
  }
  # i = 2

  mp <-parameters(mods[[i]], effects = "fixed") %>%
    parameters::format_parameters(.) %>%
    mutate(CI = sprintf(fmt = "[ %.3f, %.3f ]", CI_low, CI_high),
           p = format_p(p)) %>%
    mutate(Coefficient = format_value(Coefficient, digits = 3)) %>%
    select(Parameter, Coef. = Coefficient, SE, CI, z, p)

  perf <-
    performance::performance(mods[[i]]) %>%
    mutate(R2 = sprintf(fmt = "%.3f / %.3f", R2_marginal, R2_conditional)) %>%
    select(R2) %>%
    data.frame() %>%
    t() %>%
    data.frame() %>%
    rownames_to_column() %>%
    rename("Parameter" = "rowname" , "Coef."=".")
    # transmute(gof = paste(rowname, `.`))

  mp <- mp %>%
    bind_rows(perf) %>%
    mutate(Primary = names(mods[i])) %>%
    relocate(Primary)

  tab_models <- tab_models %>%
    bind_rows(mp)

}

tab_models

options(knitr.kable.NA = '')

model_names = tab_models %>% group_by(Primary) %>% tally() %>% pull(n)
names(model_names) = names(mods)

tab_models %>%
  mutate(Parameter = gsub(Parameter, fixed = T, pattern = "video mean pedcounts [log1p]", replacement = "Ped. counts")) %>%
  select(-Primary, -CI) %>%
  kbl(digits = 3, format = "latex",  escape = TRUE, booktabs = TRUE) %>%
  kableExtra::collapse_rows(columns = 1, valign = "top", latex_hline = "none") %>%
  add_header_above(header = c( "Outcome variable: Subjective crowding" = ncol(tab_models)), align = "l") %>%
  kable_classic() %>%
  # add_indent(which(tab_models$Parameter %in% perf$Parameter), level_of_indent = 4) %>%
  row_spec(which(tab_models$Parameter %in% perf$Parameter), align = "r", italic = T) %>%
  pack_rows(index = model_names) %>%
  save_kable( title = "Mixed effects models of Perceived Crowdedness \\label{tab:models_perceived_crowds}",
              notes = "Ped. Counts : Log-transformed, average pedestrian count per stimulus",
              file = "~/Dropbox/Apps/Overleaf/NICE Online Study/tables/table_models_perceived_crowds.tex")


