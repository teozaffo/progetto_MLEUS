<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
    <title>Decision Tree for Pancreatic Ductal Adenocarcinoma</title>

    <link rel="stylesheet" href="../static/style.css">

    <script type="text/javascript" src="../static/prediction.js"></script>

  </head>
  
  <body>

    <div class="container">
      <h2>Prediction of the model</h2>
      <h3 id="selected-model">Selected Model: </h3>

      <div class="result" id="result"></div>

      <div id="gradient-bar">
        <div id="gradient-legend-benign">Benign</div>
        <div id="gradient-legend-uncertain">Uncertain</div>
        <div id="gradient-legend-malignant">Malignant</div>
      </div>
      
      <br>

      <h2 class="feedback">
        Please give us your feedback:
      </h2>
      
      <form class="feedback" id="feedback">
        <label>
          1. On a scale from 1 (not at all) to 4 (completely), how reliable do you consider this information?
        </label><br>
<div class="radio-group dual-mode">
  <div class="radio-row-desktop">
    <label>not at all <input type="radio" name="reliability" value="1"></label>
    <label><input type="radio" name="reliability" value="2"></label>
    <label><input type="radio" name="reliability" value="3"></label>
    <label><input type="radio" name="reliability" value="4"> completely</label>
  </div>

  <div class="radio-row-mobile">
    <div class="radio-buttons">
      <label><input type="radio" name="reliability" value="1"></label>
      <label><input type="radio" name="reliability" value="2"></label>
      <label><input type="radio" name="reliability" value="3"></label>
      <label><input type="radio" name="reliability" value="4"></label>
    </div>
    <div class="radio-labels">
      <span>not at all</span>
      <span>completely</span>
    </div>
  </div>
</div>




        <label>
          2. On a scale from 1 (not at all) to 4 (completely), how useful do you find this tool?
        </label><br>
<div class="radio-group dual-mode">
  <div class="radio-row-desktop">
    <label>not at all <input type="radio" name="reliability" value="1"></label>
    <label><input type="radio" name="reliability" value="2"></label>
    <label><input type="radio" name="reliability" value="3"></label>
    <label><input type="radio" name="reliability" value="4"> completely</label>
  </div>

  <div class="radio-row-mobile">
    <div class="radio-buttons">
      <label><input type="radio" name="reliability" value="1"></label>
      <label><input type="radio" name="reliability" value="2"></label>
      <label><input type="radio" name="reliability" value="3"></label>
      <label><input type="radio" name="reliability" value="4"></label>
    </div>
    <div class="radio-labels">
      <span>not at all</span>
      <span>completely</span>
    </div>
  </div>
</div>




        <label>
          3. On a scale from 1 (not at all) to 4 (completely), to what extent do you think this information will influence your upcoming decisions regarding reporting and prescribing?
        </label><br>
<div class="radio-group dual-mode">
  <div class="radio-row-desktop">
    <label>not at all <input type="radio" name="reliability" value="1"></label>
    <label><input type="radio" name="reliability" value="2"></label>
    <label><input type="radio" name="reliability" value="3"></label>
    <label><input type="radio" name="reliability" value="4"> completely</label>
  </div>

  <div class="radio-row-mobile">
    <div class="radio-buttons">
      <label><input type="radio" name="reliability" value="1"></label>
      <label><input type="radio" name="reliability" value="2"></label>
      <label><input type="radio" name="reliability" value="3"></label>
      <label><input type="radio" name="reliability" value="4"></label>
    </div>
    <div class="radio-labels">
      <span>not at all</span>
      <span>completely</span>
    </div>
  </div>
</div>




        <div class="form-row">
          <label for="recommendability">
            4. On a scale from 0 (impossible) to 10 (certain), how likely are you to recommend this tool to a colleague?
          </label>

          <select id="recommendability" class="optional">
      
            <option value="0">0 (Impossible)</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>            
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10 (Certain)</option>
      
          </select>
        </div>

		<div style="margin-top: 2rem;"></div>
		
        <label for="reason">5. Why?</label><br>
        <textarea id="reason" rows="6" cols="70" placeholder="Explain here..."></textarea>

        <div class="button-row">
			<button id="form-submit" type="submit">Send</button>
			<button id="back-button" type="button">Back</button>
		</div>
		
		<p id="feedback-confirmation" style="margin-top: 1rem; font-weight: bold; color: green;"></p>

      </form>

    </div>
  </body>
</html>
