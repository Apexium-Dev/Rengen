from fastapi import FastAPI, HTTPException
import cdsapi
import pandas as pd
import json
import zipfile
import os

app = FastAPI()

@app.get("/ads-data/cams-europe-air-quality")
async def get_europe_air_quality():
    try:
        dataset = "cams-europe-air-quality-forecasts-optimised-at-observation-sites"
        request = {
            "variable": ["nitrogen_dioxide"],
            "country": ["north_macedonia"],
            "type": ["raw"],
            "leadtime_hour": [str(i) for i in range(24)],  # ["0", ..., "23"]
            "year": ["2025"],
            "month": ["04"],
            "day": ["18"],
            "include_station_metadata": "no",
            "format": "csv"
        }

        filename = "temp_data.zip"
        client = cdsapi.Client()
        client.retrieve(dataset, request, filename)

        # Unzip and read CSV
        with zipfile.ZipFile(filename, 'r') as zip_ref:
            csv_files = [f for f in zip_ref.namelist() if f.endswith(".csv")]
            if not csv_files:
                raise Exception("No CSV file found in the ZIP archive.")
            zip_ref.extract(csv_files[0], ".")
            csv_path = os.path.join(".", csv_files[0])

        df = pd.read_csv(csv_path)
        json_data = json.loads(df.to_json(orient="records"))

        # Clean up temporary files
        os.remove(filename)
        os.remove(csv_path)

        return {"dataset": dataset, "data": json_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
