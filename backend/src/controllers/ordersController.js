// Controlador de Preventas y Métricas de Negocio (Órdenes VI CITY)
// Responsable: Alexsander Rosales (Backend Developer)

const catalog = require('../data/catalog');
const { sendJson, sendError, parseJsonBody } = require('../utils/response');

// Base de datos en memoria para órdenes de preventa
let ordersDb = [
  {
    id: 'ord-001',
    orderNumber: 'VC-2026-8812',
    createdAt: new Date('2026-09-01T14:30:00Z').toISOString(),
    status: 'confirmada',
    customer: {
      fullName: 'Usuario Demo',
      email: 'usuario.demo@duocuc.cl',
      phone: '+56911223344'
    },
    selection: {
      platformId: 'ps5',
      editionId: 'deluxe',
      format: 'digital',
      extras: ['vip-pass']
    },
    pricing: {
      basePrice: 89990,
      extrasTotal: 29990,
      shipping: 0,
      total: 119980
    },
    payment: {
      method: 'card',
      cardLast4: '4242'
    }
  },
  {
    id: 'ord-002',
    orderNumber: 'VC-2026-9045',
    createdAt: new Date('2026-09-02T18:15:00Z').toISOString(),
    status: 'confirmada',
    customer: {
      fullName: 'Paulo Rivas',
      email: 'paulo.rivas@duocuc.cl',
      phone: '+56999887766'
    },
    selection: {
      platformId: 'pc',
      editionId: 'standard',
      format: 'digital',
      extras: []
    },
    pricing: {
      basePrice: 69990,
      extrasTotal: 0,
      shipping: 0,
      total: 69990
    },
    payment: {
      method: 'paypal',
      accountEmail: 'paulo.rivas@duocuc.cl'
    }
  }
];

// Métricas acumuladas
const metrics = {
  totalProcessedRequests: 2,
  orderCreations: 2,
  orderCancellations: 0
};

function getOrders(req, res) {
  let result = [...ordersDb];
  const { email, status } = req.query || {};

  if (email) {
    result = result.filter(o => o.customer && o.customer.email.toLowerCase() === email.toLowerCase());
  }
  if (status) {
    result = result.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  sendJson(res, 200, {
    total: result.length,
    orders: result
  });
}

function getOrderById(req, res) {
  const { id } = req.params;
  const order = ordersDb.find(o => o.id === id || o.orderNumber === id);

  if (!order) {
    sendError(res, 404, `Orden con identificador "${id}" no encontrada`);
    return;
  }
  sendJson(res, 200, order);
}

async function createOrder(req, res) {
  try {
    const payload = await parseJsonBody(req);
    const { customer, selection, payment } = payload;

    // Validaciones
    if (!customer || !customer.email || !customer.fullName) {
      sendError(res, 400, 'Datos del cliente incompletos (fullName y email requeridos)');
      return;
    }

    if (!selection || !selection.platformId || !selection.editionId) {
      sendError(res, 400, 'Selección de preventa incompleta (platformId y editionId requeridos)');
      return;
    }

    const platform = catalog.PLATFORMS.find(p => p.id === selection.platformId);
    if (!platform) {
      sendError(res, 400, `Plataforma inválida: ${selection.platformId}`);
      return;
    }

    const edition = catalog.EDITIONS.find(e => e.id === selection.editionId);
    if (!edition) {
      sendError(res, 400, `Edición inválida: ${selection.editionId}`);
      return;
    }

    const format = selection.format === 'physical' ? 'physical' : 'digital';
    const basePrice = format === 'physical' ? edition.pricePhysical : edition.priceDigital;

    if (basePrice === null) {
      sendError(res, 400, `La edición ${edition.name} no está disponible en formato ${format}`);
      return;
    }

    // Calcular extras
    let extrasTotal = 0;
    const selectedExtras = Array.isArray(selection.extras) ? selection.extras : [];
    selectedExtras.forEach(extId => {
      const ext = catalog.EXTRAS.find(e => e.id === extId);
      if (ext) extrasTotal += ext.price;
    });

    const shipping = format === 'physical' ? 4990 : 0;
    const total = basePrice + extrasTotal + shipping;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VC-2026-${randomSuffix}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'confirmada',
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone || ''
      },
      selection: {
        platformId: platform.id,
        platformName: platform.name,
        editionId: edition.id,
        editionName: edition.name,
        format,
        extras: selectedExtras
      },
      pricing: {
        basePrice,
        extrasTotal,
        shipping,
        total
      },
      payment: {
        method: payment && payment.method ? payment.method : 'card',
        cardLast4: payment && payment.cardNumber ? payment.cardNumber.slice(-4) : '9999'
      }
    };

    ordersDb.unshift(newOrder);
    metrics.orderCreations++;
    metrics.totalProcessedRequests++;

    sendJson(res, 201, {
      message: 'Preventa registrada exitosamente en VI CITY Backend',
      order: newOrder
    });
  } catch (err) {
    sendError(res, 400, err.message);
  }
}

function cancelOrder(req, res) {
  const { id } = req.params;
  const order = ordersDb.find(o => o.id === id || o.orderNumber === id);

  if (!order) {
    sendError(res, 404, `Orden con identificador "${id}" no encontrada`);
    return;
  }

  if (order.status === 'cancelada') {
    sendError(res, 400, 'La orden ya se encuentra cancelada');
    return;
  }

  order.status = 'cancelada';
  order.cancelledAt = new Date().toISOString();
  metrics.orderCancellations++;

  sendJson(res, 200, {
    message: `Orden ${order.orderNumber} cancelada exitosamente`,
    order
  });
}

function deleteOrder(req, res) {
  const { id } = req.params;
  const index = ordersDb.findIndex(o => o.id === id || o.orderNumber === id);

  if (index === -1) {
    sendError(res, 404, `Orden con identificador "${id}" no encontrada`);
    return;
  }

  const deleted = ordersDb.splice(index, 1)[0];
  sendJson(res, 200, {
    message: 'Orden eliminada de la base de datos',
    order: deleted
  });
}

function getMetrics(req, res) {
  const activeOrders = ordersDb.filter(o => o.status === 'confirmada');
  const cancelledOrders = ordersDb.filter(o => o.status === 'cancelada');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.pricing ? o.pricing.total : 0), 0);

  const byPlatform = {};
  const byEdition = {};

  activeOrders.forEach(o => {
    const plat = o.selection.platformId;
    const edit = o.selection.editionId;
    byPlatform[plat] = (byPlatform[plat] || 0) + 1;
    byEdition[edit] = (byEdition[edit] || 0) + 1;
  });

  sendJson(res, 200, {
    service: 'devops-microservice-backend',
    metrics: {
      totalOrders: ordersDb.length,
      activeOrders: activeOrders.length,
      cancelledOrders: cancelledOrders.length,
      totalRevenueCLP: totalRevenue,
      distribution: {
        byPlatform,
        byEdition
      },
      devopsStats: metrics
    },
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  deleteOrder,
  getMetrics
};
