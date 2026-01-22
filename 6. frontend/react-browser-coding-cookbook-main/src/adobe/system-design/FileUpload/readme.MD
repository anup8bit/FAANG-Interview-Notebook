


## API Request to upload file ##

1. Initiate chunk upload 
    API - /upload/initiate
    METHOD - POST
    BODY - {hash, filesize}

    Response:
     {uploadId: number, uploadedChunkc: number[]}

2. Chunk upload using upload id and index
    API - /upload/:uploadid/chunk?index={index}
    METHOD - POST
    BODY - {fileChunk, uploadId, fileSize}
    Content-Type - multipart/formdata
    Response : {id}
    Status - 200 (success), 500 (server error), 400 (client error)

4. to Check the status of file upload
    API - /upload/:uploadId/status
    METHOD - GET
    RESPONSE - 

3. Upload completed
    API - /upload/completed
    METHOD - POST
    BODY - {uploadId}