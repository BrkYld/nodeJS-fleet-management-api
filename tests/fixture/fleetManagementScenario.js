export default {
    "/api/vehicle": {
        "licence_plate": "34 TL 34"
    },
    "/api/delivery-point": [
        {
            "name": "Branch",
            "allow_to_unload": ["packet"]
        },
        {
            "name": "Distribution Center",
            "allow_to_unload": ["bag", "packet"]
        },
        {
            "name": "Transfer Center",
            "allow_to_unload": ["bag"]
        }
    ],
    "/api/delivery/bag": [
        {
            "barcode": "C725799",
            "delivery_point_for_unloading": 2
        },
        {
            "barcode": "C725800",
            "delivery_point_for_unloading": 3
        }
    ],
    "/api/delivery/packet": [
        {
            "barcode": "P7988000121",
            "delivery_point_for_unloading": 1,
            "volumetric_weight": 5
        },
        {
            "barcode": "P7988000122",
            "delivery_point_for_unloading": 1,
            "volumetric_weight": 5
        },
        {
            "barcode": "P7988000123",
            "delivery_point_for_unloading": 1,
            "volumetric_weight": 9
        },
        {
            "barcode": "P8988000120",
            "delivery_point_for_unloading": 2,
            "volumetric_weight": 33
        },
        {
            "barcode": "P8988000121",
            "delivery_point_for_unloading": 2,
            "volumetric_weight": 17
        },
        {
            "barcode": "P8988000122",
            "delivery_point_for_unloading": 2,
            "volumetric_weight": 26
        },
        {
            "barcode": "P8988000123",
            "delivery_point_for_unloading": 2,
            "volumetric_weight": 35
        },
        {
            "barcode": "P8988000124",
            "delivery_point_for_unloading": 2,
            "volumetric_weight": 1
        },
        {
            "barcode": "P8988000125",
            "delivery_point_for_unloading": 2,
            "volumetric_weight": 200
        },
        {
            "barcode": "P8988000126",
            "delivery_point_for_unloading": 2,
            "volumetric_weight": 50
        },
        {
            "barcode": "P9988000126",
            "delivery_point_for_unloading": 3,
            "volumetric_weight": 15
        },
        {
            "barcode": "P9988000127",
            "delivery_point_for_unloading": 3,
            "volumetric_weight": 16
        },
        {
            "barcode": "P9988000128",
            "delivery_point_for_unloading": 3,
            "volumetric_weight": 55
        },
        {
            "barcode": "P9988000129",
            "delivery_point_for_unloading": 3,
            "volumetric_weight": 28
        },
        {
            "barcode": "P9988000130",
            "delivery_point_for_unloading": 3,
            "volumetric_weight": 17
        }
    ],
    "/api/delivery/bag/C725800": [
        "P9988000128",
        "P9988000129"
    ],
    "/api/delivery/bag/C725799": [
        "P8988000122",
        "P8988000126"
    ],
    "transactionData": {
        "plate": "34 TL 34",
        "route": [
            {
                "deliveryPoint": 1,
                "deliveries": [
                    { "barcode": "P7988000121" },
                    { "barcode": "P7988000122" },
                    { "barcode": "P7988000123" },
                    { "barcode": "P8988000121" },
                    { "barcode": "C725799" }
                ]
            },
            {
                "deliveryPoint": 2,
                "deliveries": [
                    { "barcode": "P8988000123" },
                    { "barcode": "P8988000124" },
                    { "barcode": "P8988000125" },
                    { "barcode": "C725799" }
                ]
            },
            {
                "deliveryPoint": 3,
                "deliveries": [
                    { "barcode": "P9988000126" },
                    { "barcode": "P9988000127" },
                    { "barcode": "P9988000128" },
                    { "barcode": "P9988000129" },
                    { "barcode": "P9988000130" }
                ]
            }
        ]
    },
    "expectedResult": {
        "plate": "34 TL 34",
        "route": [
            {
                "deliveryPoint": 1,
                "deliveries": [
                    { "barcode": "P7988000121", "state": 4 },
                    { "barcode": "P7988000122", "state": 4 },
                    { "barcode": "P7988000123", "state": 4 },
                    { "barcode": "P8988000121", "state": 3 },
                    { "barcode": "C725799", "state": 3 }
                ]
            },
            {
                "deliveryPoint": 2,
                "deliveries": [
                    { "barcode": "P8988000123", "state": 4 },
                    { "barcode": "P8988000124", "state": 4 },
                    { "barcode": "P8988000125", "state": 4 },
                    { "barcode": "C725799", "state": 4 }
                ]
            },
            {
                "deliveryPoint": 3,
                "deliveries": [
                    { "barcode": "P9988000126", "state": 3 },
                    { "barcode": "P9988000127", "state": 3 },
                    { "barcode": "P9988000128", "state": 4 },
                    { "barcode": "P9988000129", "state": 4 },
                    { "barcode": "P9988000130", "state": 3 }
                ]
            }
        ]
    }
}