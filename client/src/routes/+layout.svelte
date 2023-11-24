<script>
  import { generateUsername } from "unique-username-generator";
	import { onMount } from "svelte";
  import "../app.pcss";
	import { Username } from "$lib/stores";

  onMount(() => {
    if($Username.trim().length === 0) {
      $Username = generateUsername();
    }
  })
</script>

<slot></slot>