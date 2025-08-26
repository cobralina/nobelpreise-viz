<script lang="ts">
  import type { SelectedPerson } from "../types";
  export let selectedPerson: SelectedPerson;

  function closeInfoBox() {
    selectedPerson = {
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
  }
</script>

{#if selectedPerson.name.length > 0}
  <div class="infolayer">
    <button class="infoicon-button" on:click={closeInfoBox}>
      <img
        width="12px"
        height="12px"
        class="infoicon"
        src="img/close.svg"
        alt="Close-Icon"
      />
    </button>
    <div class="headline">
      {selectedPerson.year[0]} – {selectedPerson.category[0]}
    </div>
    <div class="subline">{selectedPerson.name[0]}</div>
    <p>{selectedPerson.herkunftsland[0]}</p>
    <p>{selectedPerson.infotext[0]}</p>
    <div class="info-flex-container">
      {#if selectedPerson.imgurl[0]}
        <div class="img-container">
          <img
            src={selectedPerson.imgurl[0]}
            alt="Bild von {selectedPerson.name[0]}"
          />
          <div class="img-credit">{selectedPerson.imgcredit[0]}</div>
        </div>
      {/if}
      {#if selectedPerson.vita[0]}
        <p style="font-style:italic;">{selectedPerson.vita[0]}</p>
      {/if}
    </div>
    {#if selectedPerson.forschungsstandort[0]}
      <p>
        Forschungsstandort: {selectedPerson.forschungsstandort[0]}
      </p>
    {/if}
  </div>
{/if}
