$(function() {
		// IMPORTANT: Fill in your client key
		//var clientKey = "HgXQSe1PpRPUiXsSSsir2ZG46xEoQ4dxlbndpp2OhSJzQbsIEKaHJRLPoqeeurMP";

		var cache = {};
		var container = $("#myModal2");
		var errorDiv = container.find("div.text-error");

		/** Handle successful response */
		function handleResp(data)
		{
			// Check for error
			if (data.status !== "OK")
				errorDiv.text(data.status);
			else //if("city" in data)
			{
				// Set city and state
                //console.log(data.results[0].address_components[1].long_name);
                //console.log(data.results[0].address_components[3].long_name);
                //console.log(data.status);
				container.find("#city").val(data.results[0].address_components[1].long_name);//data.city
				container.find("#state").val(data.results[0].address_components[3].long_name);//state
			}
		}

		// Set up event handlers
		container.find("input[name='zipcode']").on("keyup change", function() {
			// Get zip code
			var zipcode = $(this).val().substring(0, 5);
			if (zipcode.length == 5 && /^[0-9]+$/.test(zipcode))
			{
				// Clear error
				errorDiv.empty();

				// Check cache
				if (zipcode in cache)
				{
					handleResp(cache[zipcode]);
				}
				else
				{
					// Build url
                    //http://maps.googleapis.com/maps/api/geocode/json?address=77379&sensor=true
                    //https://www.zipcodeapi.com/rest/"+clientKey+"/info.json/" + zipcode + "/radians
					var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+zipcode+"&sensor=true";

					// Make AJAX request
					$.ajax({
						"url": url,
						"dataType": "json"
					}).done(function(data) {
						handleResp(data);

						// Store in cache
						cache[zipcode] = data;
					}).fail(function(data) {
						if (data.responseText && (json = $.parseJSON(data.responseText)))
						{
							// Store in cache
							cache[zipcode] = json;

							// Check for error
							if (json.error_msg)
								errorDiv.text(json.error_msg);
						}
						else
							errorDiv.text('Request failed.');
					});
				}
			}
		}).trigger("change");
	});
