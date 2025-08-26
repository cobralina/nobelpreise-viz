<script lang="ts">
  import { layoutPhyllotaxis } from "../utils";
  import { dataStore } from "../store";
  import { onMount } from "svelte";
  import Infolayer from "./Infolayer.svelte";
  import type { SelectedPerson } from "../types";

  let data: any;
  let phylloThemeData: any;
  let selectedPerson: SelectedPerson = {
    year: [],
    category: [],
    name: [],
    herkunftsland: [],
    forschungsstandort: [],
    infotext: [],
    imgurl: [],
    imgcredit: [],
    vita: [],
  };

  function setPersonFromCircle(d: any) {
    // baue ein SelectedPerson-Objekt aus den Daten
    selectedPerson = {
      year: [d.jahr],
      category: [d.fach],
      name: [d.name],
      herkunftsland: [d.herkunftsland],
      forschungsstandort: [d.forschungsstandort],
      infotext: [d.beschreibung],
      imgurl: [d.foto],
      imgcredit: [d.fotoquelle],
      vita: [d.vita],
    };
  }

  onMount(() => {
    const unsubscribe = dataStore.subscribe((value) => {
      data = value;

      phylloThemeData = layoutPhyllotaxis(data, {
        spacing: 1.7,
      });
      console.log("PhylloThemeData prepared:", phylloThemeData);
    });
    return unsubscribe;
  });
</script>

<Infolayer {selectedPerson} />

<!-- Sortiert nach Themen, deutsche Gehighlightet!: -->

<svg viewBox="0 0 100 100">
  <g>
    {#each phylloThemeData as d, i}
      {#if d.herkunftsland === "Deutschland"}
        <circle
          cx={d.x}
          cy={d.y}
          r={d.r * 1.3}
          fill={d.color}
          fill-opacity={1}
          on:click={() => setPersonFromCircle(d)}
          style="cursor: pointer"
        />
      {:else}
        <circle
          cx={d.x}
          cy={d.y}
          r={d.r * 0.8}
          fill={d.color}
          fill-opacity={0.5}
        />
      {/if}
    {/each}
  </g>
</svg>
