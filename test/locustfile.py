from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
  host = "http://localhost:5000"
  wait_time = between(1, 5)
  
  @task
  def predict(self):
    response = self.client.post("/model_prediction", json={
      "model": "Explainable-DT",
      "Arteries": 1,
      "DuctRetrodilation": 1,
      "Lymphadenopathy": 1,
      "Margins": 0,
      "Ecostructure": 0
    })
    
    print(response)
