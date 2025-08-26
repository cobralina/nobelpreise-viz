<script lang="ts">
  import { layoutPhyllotaxis } from "../utils";
  import { dataStore } from "./../store";
  import { onMount } from "svelte";

  let data: any;
  let phylloYearData: any;
  let phylloThemeData: any;
  let phylloCountryData: any;

  onMount(() => {
    const unsubscribe = dataStore.subscribe((value) => {
      data = value;

      phylloThemeData = layoutPhyllotaxis(data, {
        spacing: 1.7,
      });
      const sortedYearData = data
        .slice()
        .sort((a: any, b: any) => Number(a.jahr) - Number(b.jahr)); //nach Jahren sortiert

      phylloYearData = layoutPhyllotaxis(sortedYearData, { spacing: 1.7 });

      const sortedCountryData = data
        .slice()
        .sort((a: any, b: any) =>
          a.herkunftsland.localeCompare(b.herkunftsland)
        );

      phylloCountryData = layoutPhyllotaxis(sortedCountryData, {
        spacing: 1.7,
      });
    });
    return unsubscribe;
  });
</script>

<!-- Sortiert nach Themen: -->

<svg viewBox="0 0 100 100">
  <g>
    {#each phylloThemeData as { x, y, r, color }, i}
      <circle cx={x} cy={y} {r} fill={color} />
    {/each}
  </g>
</svg>
<!-- Sortiert nach Jahren: -->
<svg viewBox="0 0 100 100">
  <g>
    {#each phylloYearData as { x, y, r, color }, i}
      <circle cx={x} cy={y} {r} fill={color} />
    {/each}
  </g>
</svg>
<!-- Sortiert nach Herkunftsländern: -->
<svg viewBox="0 0 100 100">
  <g>
    {#each phylloCountryData as { x, y, r, color }, i}
      <circle cx={x} cy={y} {r} fill={color} />
    {/each}
  </g>
</svg>
