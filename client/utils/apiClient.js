import toast from 'react-hot-toast';

const BASE_URL = "http://localhost:5001/";

export default class ApiClient {

    static async get(endpoint) {

        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "GET",
            credentials: "include"
        });

        return await this.checarResposta(response);
    }


    static async post(endpoint, body) {

        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        return await this.checarResposta(response);
    }


    static async put(endpoint, body) {

        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        return await this.checarResposta(response);
    }


    // PATCH
    static async patch(endpoint, body) {

        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        return await this.checarResposta(response);
    }


    static async delete(endpoint) {

        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
            credentials: "include"
        });

        return await this.checarResposta(response);
    }


    static async postFormData(endpoint, formData) {

        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        return await this.checarResposta(response);
    }


    static async putFormData(endpoint, formData) {

        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            credentials: "include",
            body: formData
        });

        return await this.checarResposta(response);
    }


    static async checarResposta(response) {

        let json;

        try {
            json = await response.json();
        } catch (error) {
            json = {};
        }

        if (response.ok) {

            return json;

        } else {

            toast.error(
                json.msg || "Erro na requisição"
            );

            return null;
        }
    }
}