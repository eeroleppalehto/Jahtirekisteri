import aiohttp
import asyncio


class AsyncHttpRequests:

    def __init__(self):
        self.base_url = 'http://127.0.0.1:3000/api'


    async def getAll(self, endpoint):
        """Get all data request
        Args:
            endpoint (str): Url endpoint eq. <127.0.0.1:3000/api/<endpoint>>
        Returns:
            json: Returns get response object as json
        """
        async with aiohttp.ClientSession() as session:
            async with session.get(f'{self.base_url}/{endpoint}') as response:
                status_code = response.status
                resp_data = await response.json()
                return resp_data
            
    async def post(self, endpoint, data):
        """Post data request
        Args:
            endpoint (str): Url endpoint eq. <127.0.0.1:3000/api/<endpoint>>
            data (dict): Data to post, must follow table columns exactly
        Returns:
            json: Returns post response object as json
        """
        async with aiohttp.ClientSession() as session:
            async with session.post(f'{self.base_url}/{endpoint}', json=data) as response:
                status_code = response.status
                resp_data = await response.json()
                print(resp_data)
                return resp_data

    async def updateById(self, endpoint, id, data):
        """Update data request
        Args:
            endpoint (str): Url endpoint eq. <127.0.0.1:3000/api/<endpoint>>
            id (int): Id to sort and update by
            data (dict): New data to be updated

        Returns:
            json: Returns update response object as json
        """
        async with aiohttp.ClientSession() as session:
            async with session.put(f'{self.base_url}/{endpoint}/{id}', json=data) as response:
                status_code = response.status
                resp_data = await response.json()
                return resp_data

    async def deleteById(self, endpoint, id):
        """Delete data request
        Args:
            endpoint (str): Url endpoint eq. <127.0.0.1:3000/api/<endpoint>>
            id (int): Id to sort and delete by
        Returns:
            None: Returns None on success 
        """
        async with aiohttp.ClientSession() as session:
            async with session.delete(f'{self.base_url}/{endpoint}/{id}') as response:
                status_code = response.status
                return None    
                
if __name__ == "__main__":
    async def main():
        get_member_result = await AsyncHttpRequests().getAll('members')
        get_shots_result = await AsyncHttpRequests().getAll('shots')

        #
        # post_member_data = {
        #     'etunimi': 'AsyncPost',
        #     'sukunimi': 'AsyncPost',
        #     'jakeluosoite': 'AsyncPost',
        #     'postinumero': '12332',
        #     'postitoimipaikka': 'AsyncPost',
        #     'tila': 'aktiivinen',
        # }
        # update_data = {
        #     'etunimi': 'AsyncNimiU',
        #     'sukunimi': 'AsyncSukunimiU',
        #     'jakeluosoite': 'AsyncKatuU',
        #     'postinumero': '12332',
        #     'postitoimipaikka': 'AsyncKaupunkiU',
        #     'tila': 'poistunut',
        # }
        # post_shot_data = {
        #     'jasen_id': 1,
        #     'kaatopaiva': '2023-08-22T00:00:00.000Z',
        #     'ruhopaino': 50,
        #     'paikka_teksti': 'kaadon paikka',
        #     'elaimen_nimi': 'Hirvi',
        #     'sukupuoli': 'Uros',
        #     'ikaluokka': 'Aikuinen',
        # }
        #await AsyncHttpRequests().post('members', post_data)
        #await AsyncHttpRequests().updateById('members', 44, update_data)
        #await AsyncHttpRequests().deleteById('members', 43)
        #await AsyncHttpRequests().post('shots', post_shot_data)
        
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
