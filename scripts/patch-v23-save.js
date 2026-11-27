#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = process.argv[2];
if (!path) {
  console.error('Usage: node patch-v23-save.js <path-to-web-index.html>');
  process.exit(2);
}

const html = fs.readFileSync(path, 'utf8');
if (html.includes('function normalizeSavedNumber(value,fallback=0,min=0)')) {
  console.log('v23 save normalization is already applied.');
  process.exit(0);
}

const oldLoad = "function load(){try{let s=JSON.parse(localStorage.getItem('starAcademySave2'));if(s&&typeof s==='object'){state={...state,...s};if(!s.lang)state.lang='ru';if(!state.upgrades||typeof state.upgrades!=='object')state.upgrades={};Object.keys(state.upgrades).forEach(k=>{let v=Number(state.upgrades[k]);state.upgrades[k]=Number.isFinite(v)&&v>=0?Math.floor(v):0});if(!Number.isFinite(Number(state.coins))||state.coins<0)state.coins=0}}catch(e){}}";
const newLoad = "function normalizeSavedNumber(value,fallback=0,min=0){const n=Number(value);return Number.isFinite(n)&&n>=min?n:fallback}\nfunction load(){try{let s=JSON.parse(localStorage.getItem('starAcademySave2'));if(s&&typeof s==='object'&&!Array.isArray(s)){state={...state,...s};if(!s.lang)state.lang='ru';state.coins=normalizeSavedNumber(state.coins,0);state.total=normalizeSavedNumber(state.total,0);state.level=Math.max(1,Math.floor(normalizeSavedNumber(state.level,1,1)));state.prestige=Math.floor(normalizeSavedNumber(state.prestige,0));state.enemyStage=Math.max(1,Math.floor(normalizeSavedNumber(state.enemyStage,1,1)));state.enemyHp=normalizeSavedNumber(state.enemyHp,0);state.dailyStreak=Math.floor(normalizeSavedNumber(state.dailyStreak,0));state.bossHits=Math.floor(normalizeSavedNumber(state.bossHits,0));if(!state.upgrades||typeof state.upgrades!=='object'||Array.isArray(state.upgrades))state.upgrades={};Object.keys(state.upgrades).forEach(k=>{let v=Number(state.upgrades[k]);state.upgrades[k]=Number.isFinite(v)&&v>=0?Math.floor(v):0});if(!Array.isArray(state.ownedHeroes))state.ownedHeroes=['sakura'];if(!Array.isArray(state.skills))state.skills=[];if(!Array.isArray(state.ownedSkins))state.ownedSkins=[0];if(!state.missions||typeof state.missions!=='object'||Array.isArray(state.missions))state.missions={}}}catch(e){}}";
if (!html.includes(oldLoad)) {
  console.error('The v22 load() function did not match the expected source. Refusing to patch unknown code.');
  process.exit(1);
}
fs.writeFileSync(path, html.replace(oldLoad, newLoad), 'utf8');
console.log('Applied v23 saved-state normalization.');
