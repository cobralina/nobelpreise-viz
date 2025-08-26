<script lang="ts">
  import { layoutPhyllotaxis } from "../utils";
  import { dataStore } from "../store";
  import { onMount } from "svelte";

  let data: any[] = [];
  let themeGroups: { [key: string]: any[] } = {};
  let phylloThemeGroups: { [key: string]: any[] } = {};

  onMount(() => {
    const unsubscribe = dataStore.subscribe((value) => {
      data = value;

      // Daten nach Themen aufteilen
      themeGroups = {};

      data.forEach((d) => {
        const theme = d.fach || "unbekannt";
        if (!themeGroups[theme]) themeGroups[theme] = [];
        themeGroups[theme].push(d);
      });

      console.log("Theme groups prepared:", themeGroups);
      // Phyllotaxis Layout für jedes Fach
      phylloThemeGroups = {};
      Object.entries(themeGroups).forEach(([theme, group]) => {
        phylloThemeGroups[theme] = layoutPhyllotaxis(group, {
          spacing: 1.7,
        });
      });
      console.log("PhylloThemeGroups prepared:", phylloThemeGroups);
    });
    return unsubscribe;
  });
</script>

<!-- Visualisierung der Themen -->
<div class="all-country-groups">
  {#each Object.entries(phylloThemeGroups) as [theme, group]}
    <div class="country-group">
      <svg viewBox="0 0 70 70">
        <g>
          {#each group as { x, y, r, color, herkunftsland }, i}
            <circle
              id={herkunftsland}
              cx={x}
              cy={y}
              r={herkunftsland === "Deutschland" ? r * 1.3 : r * 0.8}
              fill={color}
              fill-opacity={herkunftsland === "Deutschland" ? 1 : 0.5}
            />
          {/each}
        </g>
      </svg>
      <h2>{theme}</h2>
    </div>
  {/each}
</div>
