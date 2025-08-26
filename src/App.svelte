<script lang="ts">
  import { onMount } from "svelte";
  import { dataStore, fetchSheetData } from "./store";
  import Header from "./lib/Header.svelte";
  import VizContainer from "./lib/VizContainer.svelte";

  let data: any = [];

  onMount(() => {
    console.log("App mounted, fetching data...");
    fetchSheetData();
    // Optional: Subscribe to updates
    const unsubscribe = dataStore.subscribe((value) => {
      data = value;
    });
    console.log("Data subscribed:", data);
    return unsubscribe;
  });
</script>

<Header />

<main>
  <VizContainer />
</main>

<!-- {#if data.length}
  <ul>
    {#each data as row}
      <div class="showrow" style="background-color: {row.color};">
        {row.jahr} – {row.fach} – {row.name} - {row.thema} - Herkunftsland: {row.herkunftsland}
      </div>
    {/each}
  </ul>
{:else}
  <p>Lade Daten...</p>
{/if} -->
