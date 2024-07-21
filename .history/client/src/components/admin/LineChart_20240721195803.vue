<template>
    <div class="chart-container">
      <div class="controls">
        <label for="timeframe">Select Timeframe:</label>
        <select id="timeframe" v-model="selectedTimeframe" @change="updateChart">
          <option value="last3Months">Last 3 Months</option>
          <option value="last6Months">Last 6 Months</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>
      <canvas ref="lineChart"></canvas>
    </div>
  </template>
  