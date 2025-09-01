<script lang="ts">
  import { layoutPhyllotaxis } from "../utils";
  import { dataStore } from "../store";
  import { onMount } from "svelte";

  let data: any[] = [];
  let genderGroups: { [key: string]: any[] } = {};
  let phyllogenderGroups: { [key: string]: any[] } = {};

  onMount(() => {
    const unsubscribe = dataStore.subscribe((value) => {
      data = value;

      // Daten nach gendern aufteilen
      genderGroups = {};

      data.forEach((d) => {
        const gender = d.geschlecht || "unbekannt";
        if (!genderGroups[gender]) genderGroups[gender] = [];
        genderGroups[gender].push(d);
      });

      console.log("gender groups prepared:", genderGroups);
      // Phyllotaxis Layout für jedes Fach
      phyllogenderGroups = {};
      Object.entries(genderGroups).forEach(([gender, group]) => {
        phyllogenderGroups[gender] = layoutPhyllotaxis(group, {
          spacing: 1.7,
        });
      });
    });
    return unsubscribe;
  });
</script>

<!-- Visualisierung der gendern -->
<br /><br /><br /><br />
<div class="all-country-groups">
  {#each Object.entries(phyllogenderGroups) as [gender, group]}
    <div class="gender-group">
      <svg viewBox="0 0 90 90">
        <g>
          {#each group as { x, y, r, color }, i}
            <circle cx={x} cy={y} {r} fill={color} />
          {/each}
        </g>
      </svg>
      <h2>
        {#if gender === "m"}
          männliche Preisträger
        {:else if gender === "w"}
          weibliche Preisträger
        {:else if gender === "unbekannt"}
          Institutionen
        {:else}
          {gender}
        {/if}
      </h2>
    </div>
  {/each}
</div>
