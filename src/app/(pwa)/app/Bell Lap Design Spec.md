# **App Concept: Bell Lap (Design Specification)**

**Core Layout:** "The Ladder"

**Orientation:** Portrait (Vertical)

**Interaction Model:** Stacked horizontal bars

## **1. Race Configuration & Logic**

The app behavior is driven entirely by the selected event. This
configuration determines the total lap count, the "Count By" increment, and the
safety lockout duration.

### **Supported Modes**

- **500 SC (Short Course):** 25y pool. Total: 20 lengths.
- **1000 SC:** 25y pool. Total: 40 lengths.
- **1650 SC:** 25y pool. Total: 66 lengths.
- **800 LC (Long Course):** 50m pool. Total: 16 lengths.
- **1500 LC:** 50m pool. Total: 30 lengths.

### **Lane Count Configuration**

- **Options:** 6, 8, or 10 lanes.
- **Impact:** Dynamically adjusts the number of rows displayed in "The Stack."

### **The "Count By 2" Rule**

Since the starter stands at the Start/Finish end, touches only occur after the
swimmer has gone **down and back**.

- **Tap Increment:** Every tap adds **2 laps** (lengths) to the count.
- **Control Panel:** The (+) and (-) buttons also increment/decrement by 2.

### **Variable Lockout**

To prevent double-counting, the lockout duration scales with the course length.

- **SC Modes (50y/m per tap):** Lockout = **15 seconds**.
- **LC Modes (100m per tap):** Lockout = **30 seconds**.

## **2. Lane Configuration (Long Press to Disable)**

Heats often have empty lanes.

- **Interaction:** A **Long Press (1 second)** on the Touch Pad (Zone B) toggles
  the lane between **Active** and **Empty**.
- **The "Empty" State:**
  - **Visual:** The entire row turns Dark Grey / Low Opacity. Text displays
    "EMPTY".
  - **Controls:** The (+/-) buttons in Zone A are hidden. The Touch Pad is
    non-interactive (except for a long press to re-enable).
  - **Header Impact:** The lane number is **completely removed** from the Header
    Status (Live Leaderboard).
- **Safety:** If a lane is accidentally disabled during a race, long-pressing
  it again restores it to the previous state (count and history preserved).

## **3. The "Deck Mapping" Feature**

Ensures the screen matches the starter's physical perspective.

- **Lane 1 Start:** The list renders **Bottom-to-Top** (Lane 1 at the bottom,
  Lane 10 at the top).
- **Lane 10 Start:** The list renders **Top-to-Bottom** (Lane 10 at the bottom,
  Lane 1 at the top).
- *Benefit:* The starter taps the button corresponding to the physical lane
  position.

## **4. The Interface: "The Stack"**

The screen is divided into horizontal rows. Each row is split into two distinct
functional zones.

### **Zone A: The "Control Panel" (Left/Right Edge - 35% Width)**

Always active; controls the official count manually.

- **Layout:** Horizontal Row [ - ] [ Count ] [ + ]
  - **Left Button (-):** Decrements count by 2.
  - **Center Text:** The **Current Lap Count** (e.g., "18").
  - **Right Button (+):** Increments count by 2.

### **Zone B: The "Touch Pad" (Center - 65% Width)**

The primary interaction target.

- **Content:** Displays **Lane Number** (Watermark) and **Last Split Time** (for
  the last 2 lengths).
- **Function:**
  - **Tap:** Registers a "Touch," adds 2 to the count, and triggers the lockout.
  - **Long Press:** Toggles Empty/Active state.

## **5. Anomaly Handling (Flag, Fix, Ignore)**

The app monitors pace (time per 2 lengths) to flag potential errors.

### **A. The "Long Split" Flag (Suspected Missed Touch)**

- **Trigger:** Time since last tap > 1.8x Average Pace.
- **Visual:** Zone B turns **Purple**. Text: "LONG SPLIT?".
- **Interactive Overlay:** "Ignore" (X) button.
- **Resolution:**
  - **FIX:** Starter taps **(+)** in Zone A. Count adds 2 (total +4 including
    the missed tap).
  - **IGNORE:** Starter taps **(X)**. The time is accepted but excluded from
    pace averages.

### **B. The "Short Split" Flag (Suspected Extra Tap)**

- **Trigger:** Tap registered significantly faster than Average Pace (but after
  lockout).
- **Visual:** Zone B flashes **Yellow**. Text: "SHORT SPLIT?".
- **Resolution:**
  - **FIX:** Starter taps **(-)** in Zone A. Count subtracts 2.
  - **IGNORE:** Starter taps **(X)**. Time is accepted.

## **6. Screen Hierarchy (Top to Bottom)**

1. **Header (Fixed Top Bar):**
   - **Row 1 (Config & Reset):**
     - ![Event Dropdown][image1](Dropdown: 500 SCY, etc.).
     - ![Lane Dropdown][image2](Dropdown: 6, 8, 10).
     - ![Flip Dropdown][image3](Dropdown: "Top to bottom" vs "Bottom to top").
     - ![New Race Button][image4](Button: "New Race" / Refresh Icon).
   - **Row 2 (Status Area):** Displays the "Live Leaderboard" (see Section 7).
2. **The Lane Stack (All Lanes):**
   - A full-height list containing all configured lane rows.
   - **Order:** Determined by the [Flip] dropdown setting.
   - **Layout:** Uniform rows split into Control Panel + Touch Pad.

## **7. Header Status Logic (Live Leaderboard)**

The Status Area in the header provides a constant, real-time ranking of
**all active and finished lanes**.

### **Global Display Logic**

- **Content:** A single line of text listing all **Active** Lane Numbers sorted
  by current rank. (Empty lanes are hidden).
- **Sorting Rules (Automatic):**
  1. **Lap Count (Descending):** Swimmers with more laps are ranked higher.
  2. **Last Split Timestamp (Ascending):** Swimmers on the *same* lap count are
     sorted by who touched earlier.

### **Visual Differentiation (Distinct Color per Lap)**

To instantly visualize the spread of the field, each specific lap count is
assigned a unique color from a repeating high-contrast palette.

- **Finished:** Always **Green**.
- **Active Laps:** As a swimmer completes a lap, their lane number changes color
  to match the new lap count group.
  - *Example Palette sequence:* Blue, Red, Black, Purple, Orange, Teal.
  - *Scenario:*
    - Swimmers on Lap 18 are **Blue**.
    - Swimmers on Lap 16 are **Red**.
    - When a "Red" swimmer (Lap 16) touches the wall, their number in the
      header immediately turns **Blue** (Lap 18) and moves up the sort order.

## **8. Initialization Logic**

1. **Race Start:** Swimmers enter water. App is idle. Count = 0.
2. **First Input (Lap 2):** Swimmer returns to the wall (having swum down and
   back).
   - Starter Taps.
   - **Action:** Count becomes **2**. Timestamp recorded. (No split displayed
     yet).
3. **Second Input (Lap 4):** Swimmer returns again.
   - Starter Taps.
   - **Action:** Count becomes **4**. Split calculated (Time since Lap 2).
     Pace monitoring active.

## **9. Reset & New Race Workflow**

A dedicated workflow to prepare for the next heat safely.

- **Trigger:** Tapping the ![New Race][image4] button in Header Row 1.
- **Safety Check:** A Modal Dialog appears:
  - *Title:* "Start New Race?"
  - *Body:* "This will zero all counts and re-enable all lanes."
  - *Actions: ![Confirm][image5] ![Cancel][image6]*
- **Execution (On Confirm):**
  1. **Zero Counts:** All lap counts reset to 0.
  2. **Clear History:** All split timestamps and pace history are deleted.
  3. **Re-enable Lanes:** All lanes previously marked as "Empty" (via long
     press) are restored to "Active" status.
  4. **Clear Header:** The Live Leaderboard clears.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABFCAYAAAD3qbryAAAETUlEQVR4Xu3cO4gdZRgG4LMEJV6J6Lrh7G7O2d1gZBEkLiJYqFhEZAsvpPCCFjZBsBMkSrRIoyhamCBeEGNAAmolaUSwFCxFGzFGkMRGTOEFLIT4fntmknFIsFvI7vPAx8z/z//POeXLN3POYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwKVgNBqtpv5Jnf2fera/FwCAdZRAdjT1x8LCwl29S1OZP7Fjx469vfl1l++wnPp6PB7f3b8GALChJQRdV0EoweyH2dnZuf71zL+fILenP7/eEtSeznf5pYJb/xoAwIaWELQ79Wvq05WVlctqro4Z39Yc36w1/X3rrDp9H1WwrIDZvwgAsKElAD1R76mNx+P97Vx12qqzNjMzc1U9Du2EpC3z8/O3Z+09bbgbTMLU7syNm/F/ZHp76oHenkHuM8y+1XzW9TXO+b1Zc19qW7um1tf+rL0l17/L9zhS+3bt2nVNuwYAYMOrYJb6M/VwhaEKXjl/N+Ho5e66ptv2Ruafy/GrOm/2tx26Lyrgtetzm5ubdcdy/miOL6Y+mZubu6ICYe7zQd0j9W3qqSY4Hkr91D72XFhYuDV738n488yfbY7vZe7B9nMAADa0zvtrf6VOpn5Mnapx/721GmftS7VnNAliR2u+AlgC1IcZf9l2vkaTEHc69UKGUzW3tLR0Y8bHm45bvY92f3XeKohVCKs11b3L+W81f+6DB95fAwA2sTYgjTrvr+3cufPajD/OtaV2XMeEpn0VmHLtztSZ1GPtferXpRkfrvMmwH2W8cmsX2z2bs/4rerOZViPOfdnz0zmDqROLS4u3tTcZ89oEh5X23sPvL8GAGxmzWPIs6PO/6w14epwjltrnPNnzu9YGx/shrGS873VBWuut49Ifx9NOnbVjXutwuGg6baVun/mj1d1Putg7vVzGxZLAuN05r9JHWrnAAA2i6mEoyOjC///2pp6xNkLZu0j1HMducGkA1ZBq33vrLpkf1cXrd13Ic0PGyr4rb0rl/XbmnB3rPvjhMzfkbkzFS7P7wYA2AQ64ev76qr1r5dcf3LQ6Yo1v+w80Q1jFegy93obstqANe69h1aGw+GVOWyp8/7jz1HnUWs9Ls3+V5aXly+vzt1o0rFb+2uRHB9PPdS5LQDAxnSh99da09PTVycoPZ9rp7vzFewq4KUO1Lj55eirCW0rnTVrnbK2c9aZryB3rPM3Hge6jz8rBGbuZHXeKqSlHmnWHapgWQEzc+Mc367P6N4bAICeBKatzV+ArL17dhFbqlNWVef9i/W4tb+/xsPh8IZBp6vXzl/sPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXML+BbyO80Gq850rAAAAAElFTkSuQmCC>
[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABFCAYAAAD3qbryAAAEA0lEQVR4Xu3cTYhWVRgHcEUKo++PaWRmfD9GwxiqRVJBiwiEQlwYES2CqF3aMhdJIUS1aC+1SIpo40ZbBG0UpA8IWggFYUglbWoRGJQERUL9n5lz4fr2isuht98PHt577jn33Fn+Oefc2bABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAID/gsFgsGs4HP6Y+rtXv41GoxOLi4u3To4HAGCdJKS9k/ojtXuyDwCAdTYYDG5OfZGw9u3i4uLSZD8AAOssYW0lYe2n1LGdO3deNdkPAMA6S2B7us6ujUajg5N9U2yqgJexj87NzV032bm8vHxj5tqT30G1KwCOx+P7M35vasvk+E76NteYy5yb25g5x6nHM+ZhoRIA+N9JEDqcupBg9dBkX1/C0p0Z93l+30g9m+tTqR9SB6p/x44d1+f67dRrqXMZ80zqw9S+tA+lfs47HunPWaGvvf90zZn6dOvWrXd1/RXO0vdW6miC4pPpfyXXx5eWlq7pzwMAMLN659fOXmEFbJQxZ1Ivpbmx7rWVuYvpeqzaud6d6/0JXPfl+nzqZNo3VV/uLaT93ai3itcC3kepj7txuX4ztacbU3OmPqu/s4W3o6mvtm/fPteNAQCYaVc6v7aysnJ1C0r1Fem5jF/u+tI+UM/WHNVO6HqurlNP5P6F/O7qxvbes7oa155/PvVn6qn2fK3afdCFt3bvYO79mt99CwsLt43H43uqun4AgJnXnV/rB6meOjv2+rRQ10LcsdSpWinrPzRc2+K8ZBWsQlkFr27bdX5+/tq0T6b+Gq5tq35dW56TW521hZq+34ftf8QluJ3Ytm3b7f0xAAAzbbi2cjb1/FrC0x3pezchaW8LS/u7vlxvyb2zqcP9ZxLSbkjw+mT473BXW5l1/m119azCXNpfDacEvkn1d2TOFzP2yxbcpoVLAIDZU+fCBpf5/2stZB2pFbgW2C4Oe2fLKuAN17Y9a/vzwdQLdX/a1mdto6Z9LvVqraCN1j5aGLVg9343rtR7axu2xqXveOpM3jXf5ln9e/vBEQBgpvU+Drjk/Fr7QOBI6vsKWwlPd1cIG7WPC2qVbLi2nXm+zXGo+/qzBbhLVuxa4Pslvw+0Lc6X634FuApgFcSqnffckuv36tm2gvdNtbtt0rTvTZ2uFbdubgAAemrrsq12bap2hbx2Tm21XRK0Nv/b4pw2tlOBrULi5P1S81VfF+oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJgx/wCtrOQHy5BKBwAAAABJRU5ErkJggg==>
[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABFCAYAAAD3qbryAAADlklEQVR4Xu3dP2hdVRwH8PcIhYK1RSSk+HJz34uBqJsEURREHARxaDdB6Cgotkvr0MU/dKmLLVUESxFE6CC4CA6CIAhdMmYpFFHEoQitohYnC/X3yzs3nLy+NIUm1OHzgcM995zzbtYvv3PuTa8HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwK5aXlx8cjUZz0Z2ZnAMAYJe0bXsz2q1t2p/Rfin9taWlpdn6GbOzs/ti/PhwOHysHgcAYIdE2Poi2o3RaPT8xNRMhLA3MqzF9ZmFhYXV6F+M8X69KMZOZJiLNW/W4wAA7IAIYQ+VIHYlAtfByfmspsXcNzH3QlyvTgtlZc2LKysreybnAAC4RxG0nox2LdpXVeDqz83NPZCdDGMR6D6N9voWVTgAAHZTBLEjuZ2Z25rV2BNx/2F0+1mBGw6Hr8b9x+3t59dmmqZ5qoS4+kWEfgbBrMqVENiP/qHBYPBwtQYAgLsRweqzicpZnlv7oN76rLZNN6pweY0152L8vTJ3plsfz3opxs7G/Ndx/Tba59GOxZrLMfZ0tw4AgLtQwta/7fgt0Oul2vZHHaxKxW3T+bUSyt5dXFw8EHPfx9yXvXHY2xvtfMwtlqrcb9F/rjeuul1sx+fh9nbPAQBgGxGgfq8rZyWcfVdvfS6Mt003nV+L+7fa8fm3ZzPgRXstx/M7bRHI3s+qXAa5LqDl8/PvtFu83AAAwBba8ec4Tnb3JbCtn1+r1kw7v9bNnYr2c1bU6vGmaR6NsV+7Z5c3Sddi7Ifo76/XAgCwtdym3FQ5y0pY94ZoykpZ2Tat3yJd14WwaJ/0bv822yvR/uqendf8Wxn+6nUAANxB2ba84xZlfX4tro9He6ebi/7L0f7O82xl7lT1u9Nx/+NgMJgva7MSl+fZVro1AABsIz/J0U6pnNXqSllcj7blrFoqLxes5uc6YvxEBrccz/852o7Pr21slUb/p2hv9yYqcQAA7IAMdPkywbRgl+EsK3X1WAS5wxHO/skAly8c5G/reQAA7rPJ7VAAAP4/Zubn55fKSwqXsj+tKgcAwH0SIW0U7aNoF0o70zTNI5PrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKj9B6cmxlqH7WSXAAAAAElFTkSuQmCC>
[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAA/CAYAAABdEJRVAAADsUlEQVR4Xu3cP4gcdRgG4DsOISpCDsULu3c3d1nkRFCIh1oIio0gKZJCghZiayqLgIooCBYWNoHoodiIIAeaIEgqFRshqCBoExXUwn+NUUhEsBDi+2VncBwv5Zlinwc+5vd3tn35zc7MzQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCVMBqNrmma5s3UhdTFtn5M/ZX6IbU1mUxWhvsAAPifJZgdSP2SOtmNVVBL/0zq7Fr0lu+a9fX1pfzeB/m5R4dzAAAzbXV19cH2dO1YfzzB6amdxndLAtv9+a0LdR3OAQDMtISkE6nfE5Tu6Q3PN9PHpRcT3I72xndNfuuZhMfvV1ZWJsM5AICZlYB0S4LSz6mTm5ubV7Vj+9N/P/VxwtrN3dpqN9PHpNtpP5zrs6m3l5eXr6752p/+Vs3nHkey5rm0T3X7074v9UXqpZrP9URCYpN1x9N+J/Vn2p/m+lquj3X7AABmWoLR4Wb6ksFXqQ9Tv9UpV/tYcqG/NnM/pZ5Oc776k8nkxvRP5x772vkHUh9l/2Ib3rYroNVc1hxK+1yuD3X3S9C7dWlp6dpqexwKAHAZzeBxaNrrqa8TrN7tTs5KtTP+XZ2+Vb9CWvpb6T8x1wa4tel/3s7X6dhoNLoh97ytrXqZ4PPUmcztrfW5303pv9Xdv/E4FADgvzY2Nq5rpqdqFdAunZKV9N9opm+NHuiN1Zuk9fmPbyt4pV5MuLpjrg1rpT0l+6NpPxGSe77XnsIdbKaneOfa/fW49fkKbbUv6/akf7qq2t39AABm3mX+v7aY+mR42lVhrE7Q/tm9swph2ftkMz1Rq+B2LPuOtgHu0HB9GY/Hy8309O6F4RwAwExb3eFzHr0Q900C26gbT9i6a6fAVR/fzWUh60+lztbjzxrvgl+FtfZ3fm1P5IbmeydzB2sge+7NnseHCwEAZk19tuPlZvA5jwSluzN2vgts6e9PgHq1gtjwBKxCXNZtj8fj63P9MvOvd/97S//21GftiVu9dVonaI/0ts9n/+Fa34a6Syd6ae9N+5Vc13prAQDoq8ejCWh3Jjgd6f5n1lqo4Naeov3rDdKSjLWnDXmLw7lS982affVCwlzvv2/dXN23ezQLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMNv+Br6xzz/ChG4nAAAAAElFTkSuQmCC>
[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABCCAYAAADqrIpKAAAEyElEQVR4Xu3dW6hmYxgH8L2bnAllmjGz5/v2t21NhhITyoWYCy5c0OSsiaSkpihyyJRyDjlELmgkcoyUaMqUKymHjOGGkgsixYwyuVCK/7O/tcyy2rhjz9fvV09rrfd533ety6f3Xev7pqYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgP7ZsZmZmfjgcbpydnT2nbRwMBnPz8/MHdDsuIctGo9GKtWvXHtZPAABMjBRpB6UouymF2o+JjxIPJG5LbE7hdnGOr+V4YH/c/y3P9WDil8Tveb5r+3kAgImQQm1dCp7PqlDL+fHdXIqgl9P+a2JLt30pyTNvyvPtzrOe1s8BAOzzRqPRqSl2vk1sT8FzxCL5s5P7uY793FKR53sssXN+fn55PwcAsE+r975S6HyS+CIx6ufLmjVrTklux+rVq2f6uaVgMBgcmXg/z/jq+vXr9+vnAQD2ZdMpcu4ejt/9uqWfbDUF2wuLvb+WtpXJnTs3NzfopeojgDNqbJ1Pje81Smys7dem7S+q2GpW+zYuMl+toi2M78y5oNnO/c77awDAxKmvPlPofJXj1ymCjunnW1VI9bdKly9ffmjGPpH2NxKX5vzZxM4VK1YcUvnMeV2u70ru0xzvqL6Ju3N9ZY6fJx5Kt+lmuum0X9K039Ccv1vH9n65PivxeOa9KMfHcny4Hd+8v7anCsS2PwDARKhVtRQ6v6fgubef+yfpf8Fw/FXmZW1bzk9K/FDnzSrZ5bWFmuNXifunmuKqVuly/WZiexV3zerdrsQd7VxVPOYet6ft6M6W7Xs1x8zMzLE5fyX5C6uv7VAAYKK1BVsd+7muFET3rFu3bv86bwuu/qpcs8q1a++oxT9W6KzqLRSJw/HHAn+7OpbcuYnfhuOfGtmeuLOKtjY/sB0KAEyypsj614KtWwylSFuVMV9W0VbFW9ue662Jne1107alX9il7bLE7sTpzfU7iS8y18q9I/eqezfPeF4/V2yHAgATLYXOcYlvEtvqR3P7+ZLcaLbz/lqnYNvatnW2JZ9P30fm5uYOb1fihs3WZ/WrLctcv5h4r+bM8erKJ95Z5B8Klq1atergwXj7dVfzocGfmjnrQ4Y/f84jc96afid0+wEA7OumUxDdnIJnT+Kquu4mR6PRiWl/vdtWhV3atmXcM1Pj/u0cv9VKXeK+6te+v9ZufZZOsbeleTdta43J8cMUZ0e1/ZoPGp...>
[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABCCAYAAADqrIpKAAAIc0lEQVR4Xu3dbYhc1R3H8VmWtlptjWjYsEnm3J2MRlP6IgYfUFprCkorVCjVqiCCL0StVMRig0aRiA+lRS3RrW3QUGlrxZZA1AaNCvoi+PyUIhU1iDUq1Ci6iApC/P3mnDM9e3Y2tiUby+T7gT9z73m498zdF/vnnHvvtFoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgL3S6KJFi7pN05ykmJcL2+12p9vtfqVsOFfmz5+/v8+vzZG6DgAAYK+lJG1fJWWXhhDeUTyluFyxRXGhkqcf6/Ov+tyn7re76RyNxvGIPn4xMTFxYlU9onH80OHtqm7O6Hx/VHyg2JnC228oPlX8UzG5ZMmSxXU/AACA3UYJ0jIlHVsVT2n7G7l8xYoVX1LidJfKP1GsLvvMFZ1njRM2xXXaPrOqW674l+LePZE8lopz/8XXJZc7UQsxsX3RyWbRZU4pmR3TOR/UKc+u6wAAwJDRP/6j9I9/u2JzuQRa1J+oug8GzHbtdkrSDlQ8rvPd1u1256totKx3oqS6laluj9K4fhTi7NoldZ2u26rZ6ubKnvy7AACAL1CapXlO8ZJioq63xYsXH6m6ZxcuXLiortvd0kzfm3sy8flPaUxrFVO6Zt+uqrxM6yXTnUrczq/q5ozOt1rX63X9fZbUdQAAYHg40bgmJRqr6sosJWx/GrQE6Rkvz9Cp7rBWcU+Z+oyrz8lK8g7yvvtqf2UTHySYwfXuowTkLLX7SPtneL9s0+l02j6mPg+oyg9weW6jfj8o++Z613k/jznvy4jHr3OfVn+PbOnSpV/TMR5WPF/P7vlhDJVvU2ytk1odb4HiFMV3ymXUzAmqz+tr3KpmExP/jSZCvGfP9aNOspvoAZU/5PN7ZrLuCAAAhkBOND5vlibdx1YvlTrJOV39/6G4RLFJx7nVbZ20aHu9ym5wEqM4R203pmRsrZOU6lhO8L6lunVq94Q+3w9xxmpdrm/H5cg7FJOKZ3IimBKp3ymuTse+VcdYpXjB3y/Xa/8qfb6qz7M9FsV52t/u5M7nUdsrPU7Fy4qf/Xtk/fPnmb9p96+la7hZ8VgTk70eb4d4X9ud2j5Dn1co7vaDHUWbeYqbnLCpblLbv24VyaLKTlA8r7jZbRQ3KlkL7qOyDYqP0/XydTuv7AsAAIZEk+67UiJwXV23K2nGbYfimlZKEoqyy3zctNS6WvFGp9M5NPediPdd9WbDat1u9+sayyOhSoo8G6byc53ghJQE5Xpt/0Sx3AndRFyqHElJ2Pe9Xdbrc0qf383H1f6bHmveL2bRpp0/tZ2xHBrizNdLOsbGKhHbGGIi3En7C7Q/qf1LW9MTsjuciKXvfZzaNS5P187L1Fv8nd1Hxz9EbU4t+rIcCgDA3iAnbGXSUkvLlNcuW7bsy7lsUPKSEjHP+PSO1cQl0Hsd3i76rpktyfDMnBMdJyN1nan8WMW7oXpyNNWtrZcqS2nM05Yztf9++R3aaRZNnz/NZVmIiZyTswVVuWf9/OTo8qLM+37tx6shJpi/TEue02bAVH5BiA8qfKpzrs9Jn/ZPdlmIr1fxMTyDd3XuN9u1BQAAQ6gdlyh3mbC5TVPcSD/bvVzt+AoOL2Ue6/2cfLk8t/Fskcq21LNXmZMn1U+p3Sl1nYWYdG2tk6Y8M9eqEqJstpk77b9c3nPmRE1lbytx+mYuy8Lg5dDeE631TFcoEtfPMZKu2yshJmi9mUdf7xD/LgOvw6BrCwAAhpT+6R8e4ktfN5VLekW9l/x8f1T//rWxsbH9QpzxedjJW9H2uaZYGhwzbh/mJCS16c2QeclPba8vZ+0sJSrTZquKOi8r+n64tU2cYfqVj+O...>
