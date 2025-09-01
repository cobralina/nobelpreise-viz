<script lang="ts">
  import { layoutPhyllotaxis } from "../utils";
  import { dataStore } from "../store";
  import { onMount } from "svelte";

  let data: any[] = [];
  let countryGroups: { [key: string]: any[] } = {};
  let topCountries: string[] = [];
  let phylloCountryGroups: { [key: string]: any[] } = {};

  onMount(() => {
    const unsubscribe = dataStore.subscribe((value) => {
      data = value;

      const countryCounts: { [key: string]: number } = {};
      data.forEach((d) => {
        const country = d.herkunftsland || "unbekannt";
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });

      topCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([country]) => country);

      countryGroups = {};
      topCountries.forEach((country) => {
        countryGroups[country] = [];
      });

      data.forEach((d) => {
        const country = d.herkunftsland || "unbekannt";
        if (topCountries.includes(country)) {
          countryGroups[country].push(d);
        }
      });

      phylloCountryGroups = {};
      Object.entries(countryGroups).forEach(([country, group]) => {
        phylloCountryGroups[country] = layoutPhyllotaxis(group, {
          spacing: 1.7,
        });
      });
    });
    return unsubscribe;
  });
</script>

<!-- Visualisierung der Ländergruppen -->
<br /><br /><br /><br />
<div class="all-country-groups">
  {#each Object.entries(phylloCountryGroups) as [country, group]}
    <div class="country-group">
      <svg viewBox="0 0 70 70">
        <g>
          {#each group as { x, y, r, color }, i}
            <circle cx={x} cy={y} {r} fill={color} />
          {/each}
        </g>
      </svg>
      <h2>{country}</h2>
    </div>
  {/each}
</div>
