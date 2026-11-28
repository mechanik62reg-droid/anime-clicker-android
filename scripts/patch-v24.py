from pathlib import Path
import sys

path = Path(sys.argv[1])
html = path.read_text()
def replace_once(before, after):
    global html
    if html.count(before) != 1:
        raise ValueError(f"Unexpected source around {before[:55]}")
    html = html.replace(before, after)

replace_once("prev=needed(state.level);", """prev=state.level===1?0:needed(state.level);
const span=need-prev;
const earned=state.level>=1000?span:Math.min(span,Math.max(0,state.total-prev));""")
replace_once("fmt(state.total-prev)+' / '+fmt(need-prev)", "fmt(earned)+' / '+fmt(span)")
replace_once("Math.min(100,Math.max(0,(state.total-prev)/(need-prev)*100))", "(earned/span*100)")
replace_once("</body></html>", """<style>
/* Keep the mission heading visible while the cards scroll inside the panel. */
.right > .panel:last-child {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: min(88px, 36%);
  flex-basis: 32%;
}
.right > .panel:last-child .subnav {
  flex: none;
  flex-wrap: wrap;
  column-gap: 8px;
  align-items: baseline;
}
.right > .panel:last-child .missions {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  align-content: start;
}
</style>
</body></html>""")
path.write_text(html)
