import boto3
import re
from flask import Flask, request, send_file

app = Flask(__name__)

s3 = boto3.resource('s3')
bucket = s3.Bucket('meu-bucket')

@app.route('/download-certificado', methods=['POST'])
def download_certificado():
    numero_lote = request.args.get('numero_lote')

    # Busca o certificado correspondente ao número do lote no Amazon S3
    for obj in bucket.objects.all():
        if numero_lote in obj.key:
            # Define o Content-disposition header e retorna o arquivo como uma resposta HTTP
            filename = re.search(r'[^/]+$', obj.key).group(0)
            return send_file(obj.key, attachment_filename=filename, as_attachment=True, mimetype='application/pdf')
    
    # Retorna um erro caso não encontre o certificado correspondente
    return 'Certificado não encontrado', 404

if __name__ == '__main__':
    app.run()