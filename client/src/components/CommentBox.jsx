import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useImageStore } from '../store/imageStore';
import { FiSend, FiTrash2 } from 'react-icons/fi';

const CommentBox = ({ imageId, comments }) => {
    const { user, isAuthenticated } = useAuthStore();
    const { addComment, deleteComment } = useImageStore();
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setLoading(true);
        try {
            await addComment(imageId, commentText);
            setCommentText('');
        } catch (error) {
            alert('فشل في إضافة التعليق');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
            try {
                await deleteComment(imageId, commentId);
            } catch (error) {
                alert('فشل في حذف التعليق');
            }
        }
    };

    return (
        <div>
            <h4 className="mb-md">التعليقات ({comments.length})</h4>

            {/* Comment Form */}
            {isAuthenticated && (
                <form onSubmit={handleSubmit} className="mb-lg">
                    <div className="form-group">
                        <div style={{ position: 'relative' }}>
                            <textarea
                                className="form-textarea"
                                placeholder="أضف تعليقاً..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                rows="3"
                                style={{ paddingLeft: '50px' }}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-icon"
                                disabled={loading || !commentText.trim()}
                                style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '10px',
                                }}
                            >
                                <FiSend />
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Comments List */}
            <div>
                {comments.length === 0 ? (
                    <p className="text-center" style={{ color: 'var(--text-tertiary)' }}>
                        لا توجد تعليقات بعد
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <img
                                src={
                                    comment.user?.profileImage || 'https://via.placeholder.com/40'
                                }
                                alt={comment.user?.name}
                                className="comment-avatar"
                            />
                            <div className="comment-content">
                                <div className="comment-author">{comment.user?.name}</div>
                                <div className="comment-text">{comment.text}</div>
                                <div className="flex items-center gap-md">
                                    <span className="comment-time">
                                        {new Date(comment.createdAt).toLocaleDateString('ar-EG')}
                                    </span>
                                    {(user?._id === comment.user?._id ||
                                        user?.role === 'admin') && (
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--color-error)',
                                                    cursor: 'pointer',
                                                    fontSize: 'var(--font-size-sm)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--spacing-xs)',
                                                }}
                                            >
                                                <FiTrash2 size={14} /> حذف
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentBox;
