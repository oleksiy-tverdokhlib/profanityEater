import pandas as pd

# Load the CSV file
file_path = 'D:\\НУ ЛП\\5-курс\\2 семестр\\курсова\\коди до курсача\\swearings\\profanity_en.csv'
df = pd.read_csv(file_path, header=None)  # Assuming no header in your CSV file

# Initialize an empty list to collect the first two phrases from each row
phrase_list = []

# Iterate through each row in the dataframe
for row in df[0]:  # Assuming all phrases are in the first column
    phrases = row.split(',')  # Split the phrases by commas
    first_two_phrases = phrases[:2]  # Get the first two phrases
    phrase_list.extend(first_two_phrases)  # Add them to the list

# Remove duplicates while preserving the order
unique_phrases = list(dict.fromkeys(phrase_list))

# Output the unique phrases
print(unique_phrases[:400])
print(unique_phrases[400:800])
print(unique_phrases[800:1200])
print(unique_phrases[1200:])