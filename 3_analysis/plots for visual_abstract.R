
# two plots that are included in the graphical abstract
# requires the file 03_analysis to run first

p_beauty_crowd <- preds_beauty |>
  filter(Variable == "Crowdedness") %>%
  ggplot(aes(x = Value, y = Predicted)) +
  geom_line(aes(color = Typology), size = 1) +
  scale_color_manual(values = c("urban" = col_urban, "green" = col_green)) +
  theme_modern(axis.title.space = 10) +
  theme(
    # axis.title.x = element_blank(),
    strip.placement = "outside",
    strip.text.x = element_text(hjust = 0.5, size = 12, face = "plain"),
    axis.title.y = element_text(face = "bold"),
    plot.title = element_text(face = "bold", hjust = 0.5)
  ) +
  ggside::theme_ggside_void() +
  scale_y_continuous(expand = c(0, 0), limits = c(0, 7), breaks = c(0:7)) +
  scale_x_continuous(expand = c(0, 0), limits = c(0, 7)) +
  labs(y = "Beauty", x = "Subjective crowding")

p_beauty_crowd

p_psych_1 <- preds_psych |>
  filter(Outcome == "Valence") %>%
  dplyr::filter(Predicted <= 7) |>
  mutate(Beauty = fct_rev(as.factor(Beauty)),
         Outcome = recode_factor(Outcome, "WillingnessToWalk"="Willing.-to-walk"),
         Outcome = fct_relevel(Outcome, c("Willing.-to-walk", "Valence", "Arousal", "Restoration", "Interest", "Presence"))) |>
  ggplot(aes(x = Crowdedness, y = Predicted)) +
  geom_line(aes(size = Beauty, color = Typology, group = interaction(Beauty, Typology))) +
  scale_size_manual(values = seq(from = .05, to = 2, length.out= 7), breaks= c(1:7)) +
  scale_color_manual(values = c("urban" = col_urban, "green" = col_green)) +
  scale_alpha_ordinal(range = c(1, 0.1)) +
  theme_modern(axis.title.space = 10) +
  theme(
    strip.placement = "outside",
    strip.text.x = element_text(hjust = 0, size = 12),
    axis.title.y = element_text(face = "bold"),
    plot.title = element_text(face = "bold", hjust = 0.5)
  ) +
  ggnewscale::new_scale_fill() +
  ggside::theme_ggside_void() +
  scale_y_continuous(expand = c(0, 0), limits = c(0, 7), breaks = c(0:7)) +
  scale_x_continuous(expand = c(0, 0), limits = c(0, 7)) +
  labs(y = "Valence", x = "Subjective crowding")

p_psych_1

viz_abstract <-  p_psych_1 / p_beauty_crowd    +
  theme(legend.position = 'bottom') + guides(shape = guide_legend(nrow = 1, title.vjust = 1))

viz_abstract

ggsave(plot = viz_abstract, filename =  "output/viz_abstract.jpg", scale = 3, height = 500, width = 400, units = "px", dpi = 300)
