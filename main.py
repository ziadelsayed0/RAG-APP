from fastapi import FastAPI

app = FastAPI()


@app.get("/start")
def begin_servce():
    return {"message":"welcome to my app"}