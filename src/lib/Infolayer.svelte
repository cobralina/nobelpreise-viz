<script lang="ts">
  import type { SelectedPerson } from "../types";
  export let selectedPerson: SelectedPerson;

  function closeInfoBox() {
    selectedPerson = {
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
  }

  console.log("selectedPerson in Infolayer:", selectedPerson);
</script>

{#if selectedPerson.name !== ""}
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
      {selectedPerson.year} – {selectedPerson.category}
    </div>
    <div class="subline">{selectedPerson.name}</div>
    <p>{selectedPerson.herkunftsland}</p>
    <p>{selectedPerson.infotext}</p>
    <div class="info-flex-container">
      {#if selectedPerson.imgurl !== ""}
        <div class="img-container">
          <img
            src={selectedPerson.imgurl}
            alt="Bild von {selectedPerson.name}"
          />
          <div class="img-credit">{selectedPerson.imgcredit}</div>
        </div>
      {/if}
      {#if selectedPerson.vita !== ""}
        <p style="font-style:italic;">{selectedPerson.vita}</p>
      {/if}
    </div>
    {#if selectedPerson.forschungsstandort}
      <p>
        Forschungsstandort: {selectedPerson.forschungsstandort}
      </p>
    {/if}
  </div>
{/if}
