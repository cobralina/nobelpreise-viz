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
    });
    return unsubscribe;
  });
</script>

<!-- Visualisierung der Themen -->
<br /><br /><br />
<div class="all-country-groups">
  {#each Object.entries(phylloThemeGroups) as [theme, group]}
    <div class="country-group">
      <svg viewBox="0 0 70 70">
        <g>
          {#each group as { x, y, r, color }, i}
            <circle cx={x} cy={y} {r} fill={color} />
          {/each}
        </g>
      </svg>
      <h2>{theme}</h2>
    </div>
  {/each}
</div>
