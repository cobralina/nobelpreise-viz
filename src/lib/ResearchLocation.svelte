<script lang="ts">
  import { layoutPhyllotaxis } from "../utils";
  import { dataStore } from "../store";
  import { onMount } from "svelte";

  let data: any[] = [];
  let researchGroups: { [key: string]: any[] } = {};
  let topResearchLocations: string[] = [];
  let phylloresearchGroups: { [key: string]: any[] } = {};

  onMount(() => {
    const unsubscribe = dataStore.subscribe((value) => {
      data = value;

      // 1. Häufigkeiten zählen
      const researchCounts: { [key: string]: number } = {};
      data.forEach((d) => {
        if (!d.forschungsstandort) return;
        const researchLocation = d.forschungsstandort || "unbekannt";
        researchCounts[researchLocation] =
          (researchCounts[researchLocation] || 0) + 1;
      });

      // 2. Top 6 Forschungsstandorte bestimmen
      topResearchLocations = Object.entries(researchCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([researchLocation]) => researchLocation);

      // 3. Daten aufteilen
      researchGroups = {};
      topResearchLocations.forEach((researchLocation) => {
        researchGroups[researchLocation] = [];
      });
      //researchGroups["Sonstige"] = [];

      data.forEach((d) => {
        const researchLocation = d.forschungsstandort || "unbekannt";
        if (topResearchLocations.includes(researchLocation)) {
          researchGroups[researchLocation].push(d);
        }
      });
      console.log("researchLocation groups prepared:", researchGroups);
      // 4. Phyllotaxis Layout für jeden Standort
      phylloresearchGroups = {};
      Object.entries(researchGroups).forEach(([researchLocation, group]) => {
        phylloresearchGroups[researchLocation] = layoutPhyllotaxis(group, {
          spacing: 1.7,
        });
      });
    });
    return unsubscribe;
  });
</script>

<!-- Visualisierung der Standortgruppen -->
<br /><br /><br /><br />
<div class="all-country-groups">
  {#each Object.entries(phylloresearchGroups) as [researchLocation, group]}
    <div class="country-group" style="margin-top:-40px;">
      <svg viewBox="0 0 60 60">
        <g>
          {#each group as { x, y, r, color }, i}
            <circle cx={x} cy={y} {r} fill={color} />
          {/each}
        </g>
      </svg>
      <h3>{researchLocation}</h3>
    </div>
  {/each}
</div>
