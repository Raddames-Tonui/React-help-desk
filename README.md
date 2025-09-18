Crypto
<script type="module">
  // Generate 32 random bytes and convert to base64
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  // Convert to base64
  const base64 = btoa(String.fromCharCode(...array));
  console.log(base64);
</script>