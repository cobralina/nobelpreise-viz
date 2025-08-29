<script lang="ts">
  import { layoutPhyllotaxis } from "../utils";
  import { dataStore } from "../store";
  import { onMount } from "svelte";
  import Infolayer from "./Infolayer.svelte";
  import type { SelectedPerson } from "../types";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let data: any;
  let phylloThemeData: any[] = [];
  let selectedPerson: SelectedPerson = {
    year: "",
    category: "",
    name: "",
    herkunftsland: "",
    forschungsstandort: "",
    infotext: "",
    imgurl: "",
    imgcredit: "",
    vita: "",
  };

  // Animation für den aktuell gehoberten Kreis
  let hoveredIndex: number | null = null;
  let animatedRadius = tweened(0, { duration: 200, easing: cubicOut });

  function handleMouseEnter(i: number, d: any) {
    hoveredIndex = i;
    animatedRadius.set(d.r + 0.5);
  }

  function handleMouseLeave(i: number, d: any) {
    animatedRadius.set(d.r);
    hoveredIndex = null;
  }

  function setPersonFromCircle(d: any) {
    // baue ein SelectedPerson-Objekt aus den Daten

    selectedPerson = {
      year: d.jahr,
      category: d.fach,
      name: d.name,
      herkunftsland: d.herkunftsland,
      forschungsstandort: d.forschungsstandort,
      infotext: d.beschreibung,
      imgurl: d.foto,
      imgcredit: d.fotoquelle,
      vita: d.vita,
    };
  }

  onMount(() => {
    const unsubscribe = dataStore.subscribe((value) => {
      data = value;
      phylloThemeData = layoutPhyllotaxis(data, { spacing: 1.7 });
      // Setze animierten Radius initial auf den Radius des ersten deutschen Kreises (falls vorhanden)
      const firstDE = phylloThemeData.find(
        (d) => d.herkunftsland === "Deutschland"
      );
      animatedRadius.set(firstDE ? firstDE.r : 0);
    });
    return unsubscribe;
  });
</script>

<Infolayer {selectedPerson} />

<svg viewBox="0 0 100 100">
  <g>
    {#each phylloThemeData as d, i}
      {#if d.herkunftsland === "Deutschland"}
        <circle
          cx={d.x}
          cy={d.y}
          r={hoveredIndex === i ? $animatedRadius * 1.3 : d.r * 1.3}
          fill={d.color}
          fill-opacity={1}
          on:click={() => setPersonFromCircle(d)}
          on:mouseenter={() => handleMouseEnter(i, d)}
          on:mouseleave={() => handleMouseLeave(i, d)}
          style="cursor: pointer"
          class="animated-circle"
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

<style>
</style>
