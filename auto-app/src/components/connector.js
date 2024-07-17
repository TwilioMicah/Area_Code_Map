export const data_flask = async () => {

const server_data =fetch('https://taskassigner.micahphelps2.repl.co/task')
     .then(function (response) {
         return response.json();
     }).then(function (text) {
        return text
     });

const a = await server_data

return a

}
