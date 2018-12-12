<template>
  <div class="availability-tile ava-tile-2">
    <div class="availability-tile-header">
            <div class="ava-tile-header-title">
                <h2>{{ $t("label.projectsOverview") }}</h2>
                <div class="availability-tile-underscore"></div>
            </div>
        </div>
    <p class="notAuthToAddProject">{{ $t("message.notAuthToAddProject") }}</p>
  </div> 
</template>
<script>
export default {
    props: ['selected-type', 'selected-user', 'auth-type']
};
</script>