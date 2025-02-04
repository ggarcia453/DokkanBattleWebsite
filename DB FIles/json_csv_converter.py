import pandas as pd
import sys

if __name__ == "__main__":
    file = sys.argv[1]
    df = pd.read_json(file)
    df = df.drop(['links', 'categories'], axis=1)
    df['hp'] = df['hp'].str.replace(',', '')
    df['hp'] = df['hp'].astype(int)
    df['atk'] = df['atk'].str.replace(',', '')
    df['atk'] = df['atk'].astype(int)
    df['def'] = df['def'].str.replace(',', '')
    df['def'] = df['def'].astype(int)
    df.to_csv('card_output.csv', index=False)