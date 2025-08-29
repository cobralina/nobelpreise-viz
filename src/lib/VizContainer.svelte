<script lang="ts">
  import Siema from "siema";
  import { onMount } from "svelte";
  import InitViz from "./InitViz.svelte";
  import GermanWinners from "./GermanWinners.svelte";
  import OriginCountry from "./OriginCountry.svelte";
  import Themes from "./Themes.svelte";
  import ThemesGermans from "./ThemesGermans.svelte";
  import ResearchLocation from "./ResearchLocation.svelte";
  import Gender from "./Gender.svelte";
  import Timeline from "./Timeline.svelte";

  // Typisierung
  let slider: Siema;
  let prev: () => void;
  let next: () => void;
  let radioSlider: HTMLInputElement | null = null;

  let select: number = 0;
  let slideCount: number = 0;
  let slideIndices: number[] = [];

  onMount(() => {
    slider = new Siema({
      selector: ".siema",
      duration: 200,
      easing: "ease-in-out",
      perPage: 1,
      startIndex: 0,
      draggable: false,
      multipleDrag: false,
      threshold: 20,
      loop: false,
      rtl: false,
      onInit: () => {},
      onChange: () => {},
    });

    prev = () => {
      slider.prev();
      if (select > 0) {
        select--;
      }
    };

    next = () => {
      slider.next();
      if (select < slideCount - 1) {
        select++;
      }
    };

    // Anzahl der Slides ermitteln
    slideCount =
      document.querySelectorAll<HTMLDivElement>(".siema-item").length;
    slideIndices = Array.from({ length: slideCount }, (_, i) => i);
  });
</script>

<div class="carousel">
  <div class="btn-back" on:click={prev}>&nbsp;</div>

  <div class="siema">
    <div class="siema-item">
      <h2>Alle Preisträger</h2>
      <InitViz />
    </div>
    <div class="siema-item">
      <h2>Deutsche Gewinner</h2>
      <GermanWinners />
    </div>
    <div class="siema-item">
      <h2>Thematische Verteilung</h2>
      <Themes />
    </div>
    <div class="siema-item">
      <h2>Deutsche Gewinner nach Themen sortiert</h2>
      <ThemesGermans />
    </div>
    <div class="siema-item">
      <h2>Die häufigsten Herkunftsländer der Preisträger</h2>
      <OriginCountry />
    </div>
    <div class="siema-item">
      <h2>Die häufigsten Forschungsstandorte</h2>
      <ResearchLocation />
    </div>
    <div class="siema-item">
      <h2>Geschlechterverteilung</h2>
      <Gender />
    </div>
    <div class="siema-item">
      <h2>Zeitleiste</h2>
      <Timeline />
    </div>
  </div>

  <div class="btn-forward" on:click={next}>&nbsp;</div>
</div>

<div class="bullet">
  {#each slideIndices as i}
    <input
      bind:this={radioSlider}
      type="radio"
      id={String(i)}
      name="slider-radio"
      value={i}
      checked={select === i}
      on:click={() => {
        slider.goTo(i);
        select = i;
      }}
    />
  {/each}
</div>

<style>
</style>
