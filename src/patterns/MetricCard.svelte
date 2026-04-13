<script lang="ts">
  let {
    value,
    label,
    class: className = ""
  } = $props<{
    value: string;
    label: string;
    class?: string;
  }>();
</script>

<li class="ui-metric-card{className ? ` ${className}` : ''}">
  <strong class="ui-metric-card__value">{value}</strong>
  <span class="ui-muted">{label}</span>
</li>
