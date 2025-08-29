<script lang="ts">
  import { dataStore } from "../store";
  import { onMount } from "svelte";
  import type {
    originDataObject,
    GroupedByYear,
    CircleData,
    SelectedPerson,
  } from "../types";
  import Infolayer from "./Infolayer.svelte";

  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let data: any[] = [];
  let groupedData: GroupedByYear = [];
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

  const SVG_WIDTH = 600;
  const SPACING = 25;

  function getCirclesForYear(persons: originDataObject[]): CircleData[] {
    const count = persons.length;
    const totalWidth = (count - 1) * SPACING;
    const startX = (SVG_WIDTH - totalWidth) / 2;
    return persons.map((person, i) => ({
      ...person,
      cx: startX + i * SPACING,
    }));
  }

  function groupByYear(data: originDataObject[] = []): GroupedByYear {
    const yearMap: { [jahr: string]: originDataObject[] } = {};

    data.forEach((obj) => {
      const y = obj.jahr;

      if (!yearMap[y]) {
        yearMap[y] = [];
      }
      yearMap[y].push(obj);
    });

    return Object.entries(yearMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, objs]) => ({ [year]: objs }));
  }

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
      console.log("data in timeline:", data);
      groupedData = groupByYear(data);
      console.log("groupedData in timeline:", groupedData);
    });
    return unsubscribe;
  });
</script>

<Infolayer {selectedPerson} />

<div class="timeline">
  {#each groupedData as d}
    <h2>{Object.keys(d)[0]}</h2>
    <svg viewBox={`0 0 ${SVG_WIDTH} 50`}>
      <g>
        {#each getCirclesForYear(d[Object.keys(d)[0]]) as person, i}
          <circle
            cx={300 - person.cx}
            cy="-10"
            r="7"
            fill={person.color}
            on:click={() => setPersonFromCircle(person)}
            on:mouseenter={() => handleMouseEnter(i, person)}
            on:mouseleave={() => handleMouseLeave(i, person)}
            style="cursor: pointer"
            class="animated-circle"
          />
        {/each}
      </g>
    </svg>
  {/each}
</div>
