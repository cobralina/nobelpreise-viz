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

  let timelineContainer: HTMLDivElement;

  let scrollInterval: ReturnType<typeof setInterval> | null = null;
  const SCROLL_AMOUNT = 100;

  function startScroll(direction: "up" | "down") {
    stopScroll();
    scrollInterval = setInterval(() => {
      if (timelineContainer) {
        const amount = direction === "up" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
        timelineContainer.scrollBy({ top: amount, behavior: "smooth" });
      }
    }, 50);
  }

  function stopScroll() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  }

  function getCirclesForYear(persons: originDataObject[]): CircleData[] {
    const count = persons.length;
    const totalWidth = (count - 1) * SPACING;
    const startX = (SVG_WIDTH - totalWidth) / 2;
    return persons.map((person, i) => ({
      ...person,
      cx: startX + i * SPACING,
      hovered: false,
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
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0])) // <--- absteigend!
      .map(([year, objs]) => ({ [year]: objs }));
  }

  let hoveredPerson: string | null = null;

  function handleMouseEnter(person: any) {
    hoveredPerson = person.name;
  }

  function handleMouseLeave(person: any) {
    hoveredPerson = null;
  }

  function setPersonFromCircle(d: any) {
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
<br />
<div class="timeline-outer">
  <button
    class="scroll-btn up"
    on:mousedown={() => startScroll("up")}
    on:touchstart={() => startScroll("up")}
    on:mouseenter={() => startScroll("up")}
    on:mouseup={stopScroll}
    on:mouseleave={stopScroll}
    on:touchend={stopScroll}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.96967 16.0306C4.67678 15.7377 4.67678 15.2629 4.96967 14.97L11.9697 7.96998C12.2626 7.67708 12.7374 7.67708 13.0303 7.96998L20.0303 14.97C20.3232 15.2629 20.3232 15.7377 20.0303 16.0306C19.7374 16.3235 19.2626 16.3235 18.9697 16.0306L12.5 9.56097L6.03033 16.0306C5.73744 16.3235 5.26256 16.3235 4.96967 16.0306Z"
        fill="#8E8E8E"
      />
    </svg>
  </button>
  <div class="timeline-inner" bind:this={timelineContainer}>
    <br /><br />
    {#each groupedData as d}
      <h2>{Object.keys(d)[0]}</h2>
      <svg viewBox={`0 0 ${SVG_WIDTH} 50`}>
        <g>
          {#each getCirclesForYear(d[Object.keys(d)[0]]) as person, i}
            <circle
              cx={300 - person.cx}
              cy="-10"
              r={hoveredPerson === person.name ? 12 : 9}
              fill={person.color}
              on:click={() => setPersonFromCircle(person)}
              on:mouseenter={() => handleMouseEnter(person)}
              on:mouseleave={() => handleMouseLeave(person)}
              style="cursor: pointer"
              class="animated-circle"
            />
          {/each}
        </g>
      </svg>
    {/each}
    <br /><br />
  </div>
  <button
    class="scroll-btn down"
    on:mousedown={() => startScroll("down")}
    on:touchstart={() => startScroll("down")}
    on:mouseenter={() => startScroll("down")}
    on:mouseleave={stopScroll}
    on:mouseup={stopScroll}
    on:touchend={stopScroll}
  >
    <svg
      width="24"
      height="40"
      style="margin-bottom:-30px;"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.5303 7.96998C19.8232 8.26287 19.8232 8.73774 19.5303 9.03064L12.5303 16.0306C12.2374 16.3235 11.7626 16.3235 11.4697 16.0306L4.46967 9.03064C4.17678 8.73774 4.17678 8.26287 4.46967 7.96998C4.76256 7.67708 5.23744 7.67708 5.53033 7.96998L12 14.4396L18.4697 7.96998C18.7626 7.67708 19.2374 7.67708 19.5303 7.96998Z"
        fill="#8E8E8E"
      />
    </svg>
  </button>
</div>

<style>
</style>
