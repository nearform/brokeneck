import React from 'react'
import { SvgIcon } from '@material-ui/core'

const Azure = props => (
  <SvgIcon {...props} viewBox="0 0 18 18">
    <defs>
      <linearGradient
        id="gradientA"
        x1="13.25"
        y1="13.02"
        x2="8.62"
        y2="4.25"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#1988d9" />
        <stop offset=".9" stopColor="#54aef0" />
      </linearGradient>
      <linearGradient
        id="gradientB"
        x1="11.26"
        y1="10.47"
        x2="14.46"
        y2="15.99"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".1" stopColor="#54aef0" />
        <stop offset=".29" stopColor="#4fabee" />
        <stop offset=".51" stopColor="#41a2e9" />
        <stop offset=".74" stopColor="#2a93e0" />
        <stop offset=".88" stopColor="#1988d9" />
      </linearGradient>
    </defs>
    <path
      fill="#50e6ff"
      d="M1.01 10.19l7.92 5.14 8.06-5.16L18 11.35l-9.07 5.84L0 11.35l1.01-1.16z"
    />
    <path fill="#fff" d="M1.61 9.53L8.93.81l7.47 8.73-7.47 4.72-7.32-4.73z" />
    <path fill="#50e6ff" d="M8.93.81v13.45L1.61 9.53 8.93.81z" />
    <path fill="url(#gradientA)" d="M8.93.81v13.45l7.47-4.72L8.93.81z" />
    <path fill="#53b1e0" d="M8.93 7.76l7.47 1.78-7.47 4.72v-6.5z" />
    <path fill="#9cebff" d="M8.93 14.26L1.61 9.53l7.32-1.77v6.5z" />
    <path
      fill="url(#gradientB)"
      d="M8.93 17.19L18 11.35l-1.01-1.18-8.06 5.16v1.86z"
    />
  </SvgIcon>
)

export default Azure
