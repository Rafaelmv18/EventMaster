import { useState } from 'react';
import { Plus, Trash2, Clock, ArrowRight, Layers, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { TicketBatch } from '../App';

interface BatchManagerProps {
  ticketTypeId: string;
  batches: TicketBatch[];
  onBatchesChange: (batches: TicketBatch[]) => void;
}

export function BatchManager({ ticketTypeId, batches, onBatchesChange }: BatchManagerProps) {
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  // Cálculos de resumo
  const totalQuantity = batches.reduce((sum, b) => sum + (b.quantity || 0), 0);
  const averagePrice = batches.length > 0 
    ? batches.reduce((sum, b) => sum + (b.price || 0), 0) / batches.length 
    : 0;
  const minPrice = batches.length > 0 ? Math.min(...batches.map(b => b.price || 0)) : 0;
  const maxPrice = batches.length > 0 ? Math.max(...batches.map(b => b.price || 0)) : 0;

  const handleAddBatch = () => {
    const newBatch: TicketBatch = {
      id: Date.now().toString(),
      name: `Lote ${batches.length + 1}`,
      price: 0,
      quantity: 0,
      availableQuantity: 0,
      startDate: '',
      endDate: ''
    };
    onBatchesChange([...batches, newBatch]);
    setExpandedBatchId(newBatch.id);
  };

  const handleRemoveBatch = (batchId: string) => {
    onBatchesChange(batches.filter(b => b.id !== batchId));
  };

  const handleBatchChange = (batchId: string, field: keyof TicketBatch, value: any) => {
    onBatchesChange(
      batches.map(b => {
        if (b.id === batchId) {
          const updated = { ...b, [field]: value };
          // Sync availableQuantity with quantity when quantity changes
          if (field === 'quantity') {
            updated.availableQuantity = value;
          }
          return updated;
        }
        return b;
      })
    );
  };

  const toggleBatchExpansion = (batchId: string) => {
    setExpandedBatchId(expandedBatchId === batchId ? null : batchId);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-indigo-600" />
          <Label className="text-sm">Lotes Progressivos</Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddBatch}
          className="gap-2"
        >
          <Plus className="size-4" />
          Adicionar Lote
        </Button>
      </div>

      {batches.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Layers className="size-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            Nenhum lote configurado. Adicione lotes para criar uma venda progressiva.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Os lotes serão ativados automaticamente em sequência
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Timeline Visual */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg p-4 border border-indigo-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Clock className="size-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-indigo-900">Linha do Tempo - Venda em Cascata</div>
                <div className="text-xs text-indigo-600">Progressão Automática de Lotes</div>
              </div>
            </div>
            
            {/* CORREÇÃO AQUI: flex-wrap permite que os itens desçam de linha */}
            <div className="flex flex-wrap items-center gap-4 pb-2">
              {batches.map((batch, index) => (
                <div key={batch.id} className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <div className="bg-white border-2 border-indigo-300 rounded-lg px-4 py-3 min-w-[140px] shadow-sm hover:shadow-md transition-shadow">
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div className="text-xs text-indigo-600 mb-1">{batch.name}</div>
                      <div className="text-base text-gray-900">
                        {batch.price > 0 ? `R$ ${batch.price.toFixed(2)}` : 'R$ --,--'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {batch.quantity > 0 ? `${batch.quantity} ingressos` : '-- ingressos'}
                      </div>
                      {batch.startDate && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(batch.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </div>
                      )}
                    </div>
                  </div>
                  {index < batches.length - 1 && (
                    <div className="flex flex-col items-center flex-shrink-0">
                      <ArrowRight className="size-5 text-indigo-400" />
                      <span className="text-xs text-indigo-500 mt-1">Auto</span>
                      {batch.price > 0 && batches[index + 1].price > batch.price && (
                        <TrendingUp className="size-3 text-green-500 mt-1" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white/80 rounded-lg border border-indigo-200">
              <p className="text-xs text-indigo-800 flex items-start gap-2">
                <span className="text-base">💡</span>
                <span>
                  <strong>Como funciona:</strong> Quando o Lote {batches.length > 0 ? '1' : 'N'} esgotar ou expirar, o Lote {batches.length > 1 ? '2' : 'N+1'} é ativado automaticamente. 
                  Esta progressão continua até o último lote ou até a data do evento.
                </span>
              </p>
            </div>
          </div>

          {/* Batch Details */}
          {batches.map((batch, index) => (
            <div key={batch.id} className="bg-white border rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleBatchExpansion(batch.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm text-gray-900">{batch.name}</div>
                    <div className="text-xs text-gray-500">
                      {batch.quantity > 0 && batch.price > 0
                        ? `${batch.quantity} ingressos × R$ ${batch.price.toFixed(2)}`
                        : 'Configure os dados do lote'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBatch(batch.id);
                    }}
                  >
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </div>

              {expandedBatchId === batch.id && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`batch-name-${batch.id}`} className="text-xs">
                        Nome do Lote
                      </Label>
                      <Input
                        id={`batch-name-${batch.id}`}
                        type="text"
                        placeholder="ex: Lote 1, Early Bird"
                        value={batch.name}
                        onChange={(e) => handleBatchChange(batch.id, 'name', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`batch-price-${batch.id}`} className="text-xs">
                        Preço (R$)
                      </Label>
                      <Input
                        id={`batch-price-${batch.id}`}
                        type="number"
                        placeholder="150.00"
                        value={batch.price}
                        onChange={(e) => handleBatchChange(batch.id, 'price', parseFloat(e.target.value))}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`batch-quantity-${batch.id}`} className="text-xs">
                        Quantidade Disponível
                      </Label>
                      <Input
                        id={`batch-quantity-${batch.id}`}
                        type="number"
                        placeholder="100"
                        value={batch.quantity}
                        onChange={(e) => handleBatchChange(batch.id, 'quantity', parseInt(e.target.value))}
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`batch-start-${batch.id}`} className="text-xs">
                        Data de Início
                      </Label>
                      <Input
                        id={`batch-start-${batch.id}`}
                        type="datetime-local"
                        value={batch.startDate}
                        onChange={(e) => handleBatchChange(batch.id, 'startDate', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`batch-end-${batch.id}`} className="text-xs">
                        Data de Fim (ou quando esgotar)
                      </Label>
                      <Input
                        id={`batch-end-${batch.id}`}
                        type="datetime-local"
                        value={batch.endDate}
                        onChange={(e) => handleBatchChange(batch.id, 'endDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
                      💡 <strong>Dica:</strong> O lote {index + 1}{' '}
                      {index === 0
                        ? 'será o primeiro a ser vendido.'
                        : `será ativado automaticamente quando o Lote ${index} esgotar ou expirar.`}
                    </div>
                    {index > 0 && batch.price > 0 && batches[index - 1].price > 0 && (
                      <div className={`p-3 rounded text-xs ${
                        batch.price > batches[index - 1].price
                          ? 'bg-green-50 border border-green-100 text-green-800'
                          : batch.price < batches[index - 1].price
                          ? 'bg-amber-50 border border-amber-100 text-amber-800'
                          : 'bg-gray-50 border border-gray-100 text-gray-800'
                      }`}>
                        {batch.price > batches[index - 1].price && (
                          <>📈 <strong>Preço Progressivo:</strong> Aumento de R$ {(batch.price - batches[index - 1].price).toFixed(2)} em relação ao lote anterior</>
                        )}
                        {batch.price < batches[index - 1].price && (
                          <>⚠️ <strong>Atenção:</strong> Preço menor que o lote anterior. Considere usar preços progressivos.</>
                        )}
                        {batch.price === batches[index - 1].price && (
                          <>➡️ <strong>Mesmo preço:</strong> Este lote tem o mesmo valor do anterior.</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Resumo dos Lotes */}
          {batches.length > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
              <div className="text-sm text-gray-700 mb-3">📊 Resumo Geral dos Lotes</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Total de Ingressos</div>
                  <div className="text-lg text-gray-900">{totalQuantity}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Número de Lotes</div>
                  <div className="text-lg text-gray-900">{batches.length}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Preço Mínimo</div>
                  <div className="text-lg text-green-600">R$ {minPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Preço Máximo</div>
                  <div className="text-lg text-red-600">R$ {maxPrice.toFixed(2)}</div>
                </div>
              </div>
              {minPrice > 0 && maxPrice > minPrice && (
                <div className="mt-3 text-xs text-gray-600">
                  💰 Valorização progressiva de <strong>R$ {(maxPrice - minPrice).toFixed(2)}</strong> ({Math.round(((maxPrice - minPrice) / minPrice) * 100)}% de aumento)
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}