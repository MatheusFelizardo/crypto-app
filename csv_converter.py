import pandas as pd

def convert_csv_to_json(csv_path, json_path):
    df = pd.read_csv(csv_path)
    df.to_json(json_path, orient='records')

convert_csv_to_json('./public/digital_currency_list.csv', './public/digital_currency_list.json')
convert_csv_to_json('./public/physical_currency_list.csv', './public/physical_currency_list.json')