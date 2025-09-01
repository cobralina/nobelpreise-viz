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
  import WinnersTimeline from "./WinnersTimeline.svelte";
  import NewWinners from "./NewWinners.svelte";

  // Typisierung
  let slider: Siema;
  let prev: () => void;
  let next: () => void;
  let radioSlider: HTMLInputElement | null = null;

  let select: number = 0;
  let slideCount: number = 0;
  let slideIndices: number[] = [];

  $: isAtStart = select === 0;
  $: isAtEnd = select === slideCount - 1;

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
  <div class="btn-back {isAtStart ? 'disabled' : ''}" on:click={prev}>
    &nbsp;
  </div>

  <div class="siema">
    <div class="siema-item">
      <h2>Alle Preisträger</h2>
      <h3>
        Jeder Punkt steht für eine Person, die seit 1901 einen Nobelpreis
        erhalten hat. Die Farbe zeigt das Fachgebiet.
      </h3>
      <InitViz />
    </div>
    <div class="siema-item">
      <h2>Die aktuellen Gewinner</h2>
      <h3>
        Klicken Sie auf die aktivierten Kreise, um Informationen zum Preisträger
        zu erhalten.
      </h3>
      <NewWinners />
    </div>
    <div class="siema-item">
      <h2>Alle Deutschen Gewinner</h2>
      <h3>
        Deutsche Preisträger sind in allen Fachgebieten vertreten, am häufigsten
        jedoch in den Naturwissenschaften.
      </h3>
      <GermanWinners />
    </div>
    <div class="siema-item">
      <h2>Thematische Verteilung</h2>
      <h3>
        In Wirtschaft gab es mehr Einzelpersonen, in Kategorien wie Medizin
        wurden öfters mehrere Personen ausgezeichnet.
      </h3>
      <Themes />
    </div>
    <div class="siema-item">
      <h2>Deutsche Gewinner nach Themen sortiert</h2>
      <h3>
        Die meisten deutschen Preisträger gab es bisher in den
        naturwissenschaftlichen Bereichen Chemie, Medizin und Physik.
      </h3>
      <ThemesGermans />
    </div>
    <div class="siema-item">
      <h2>Die häufigsten Herkunftsländer der Preisträger</h2>
      <h3>Aus den USA stammen die meisten Nobelpreis-Gewinner.</h3>
      <OriginCountry />
    </div>
    <div class="siema-item">
      <h2>Die häufigsten Forschungsstandorte</h2>
      <h3>
        Die erfolgreichsten Foruschungseinrichtungen befinden sich in den USA.
      </h3>
      <ResearchLocation />
    </div>
    <div class="siema-item">
      <h2>Geschlechterverteilung</h2>
      <h3>Es befinden sich deutlich mehr Männer unter den Preisträgern.</h3>
      <Gender />
    </div>
    <div class="siema-item">
      <h2>Zeitleiste</h2>
      <h3>
        Sehen Sie hier die chronologische Verteilung der Nobelpreisträger.
        Klicken Sie auf ein Kreissymbol, um weitere Informationen zu erhalten.
      </h3>
      <WinnersTimeline />
    </div>
  </div>

  <div
    class="btn-forward {isAtEnd ? 'disabled' : ''}"
    on:click={next}
    disabled={isAtEnd}
    aria-disabled={isAtEnd}
  >
    &nbsp;
  </div>
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
